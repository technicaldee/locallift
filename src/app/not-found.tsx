'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="glass-card p-8 rounded-3xl">
          <div className="text-8xl mb-6">🤔</div>
          
          <h1 className="text-3xl font-bold text-slate-700 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-slate-600 mb-8">
            Looks like this business has moved! Let&apos;s get you back to discovering great investment opportunities.
          </p>
          
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}