'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast, Toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, dismiss, subscribe } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      // Force re-render when toasts change
    });
    return unsubscribe;
  }, [subscribe]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastComponentProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastComponent({ toast, onDismiss }: ToastComponentProps) {
  const isDestructive = toast.variant === 'destructive';

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'glass-card p-4 rounded-2xl shadow-lg border max-w-sm',
        isDestructive
          ? 'border-red-200 bg-red-50/80'
          : 'border-green-200 bg-green-50/80'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isDestructive ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'text-sm font-semibold',
            isDestructive ? 'text-red-900' : 'text-green-900'
          )}>
            {toast.title}
          </h4>
          {toast.description && (
            <p className={cn(
              'text-sm mt-1',
              isDestructive ? 'text-red-700' : 'text-green-700'
            )}>
              {toast.description}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onDismiss(toast.id)}
          className={cn(
            'flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors',
            isDestructive ? 'text-red-500' : 'text-green-500'
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}