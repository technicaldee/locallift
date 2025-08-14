'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { Business, Comment } from '@/types';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';

interface CommentDialogProps {
  business: Business;
  onClose: () => void;
}

export function CommentDialog({ business, onClose }: CommentDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useFarcaster();

  useEffect(() => {
    loadComments();
  }, [business.id]);

  const loadComments = async () => {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('businessId', '==', business.id),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const commentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Comment[];
      
      setComments(commentData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const userWallet = user.verifications[0] || `fid:${user.fid}`;
      
      await addDoc(collection(db, 'comments'), {
        businessId: business.id,
        userWallet,
        username: user.username,
        avatar: user.pfpUrl,
        content: newComment.trim(),
        timestamp: new Date(),
      });

      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-indigo-500" />
            Comments - {business.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>
                    {comment.username?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.username || `User ${comment.userWallet.slice(-6)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {comment.timestamp?.toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <div className="h-12 w-12 glass rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="h-6 w-6 text-slate-400" />
              </div>
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this business..."
            rows={3}
            className="resize-none"
          />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white soft-shadow"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}