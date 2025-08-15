'use client';

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const toastState: ToastState = {
  toasts: [],
};

const listeners: Array<(state: ToastState) => void> = [];

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE;
  return toastCount.toString();
}

function addToast(toast: Omit<Toast, 'id'>) {
  const id = genId();
  const newToast: Toast = {
    ...toast,
    id,
    duration: toast.duration ?? 5000,
  };

  toastState.toasts = [newToast, ...toastState.toasts];
  listeners.forEach((listener) => listener(toastState));

  // Auto remove toast after duration
  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }

  return id;
}

function removeToast(id: string) {
  toastState.toasts = toastState.toasts.filter((toast) => toast.id !== id);
  listeners.forEach((listener) => listener(toastState));
}

export function toast(props: Omit<Toast, 'id'>) {
  return addToast(props);
}

export function useToast() {
  const [state, setState] = useState<ToastState>(toastState);

  const subscribe = useCallback((listener: (state: ToastState) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const unsubscribe = useCallback(() => {
    listeners.length = 0;
  }, []);

  return {
    toasts: state.toasts,
    toast: addToast,
    dismiss: removeToast,
    subscribe,
    unsubscribe,
  };
}