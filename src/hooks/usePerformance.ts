'use client';

import { useEffect } from 'react';

export function usePerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
      
      // Track performance in production
      if (process.env.NODE_ENV === 'production' && renderTime > 100) {
        // Track slow renders
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'slow_render', {
            component: componentName,
            render_time: Math.round(renderTime),
          });
        }
      }
    };
  }, [componentName]);
}

export function measureAsync<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now();
  
  return operation().finally(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${operationName} took ${duration.toFixed(2)}ms`);
    }
    
    // Track slow operations in production
    if (process.env.NODE_ENV === 'production' && duration > 1000) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'slow_operation', {
          operation: operationName,
          duration: Math.round(duration),
        });
      }
    }
  });
}