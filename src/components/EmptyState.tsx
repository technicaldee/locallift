'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="h-16 w-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}