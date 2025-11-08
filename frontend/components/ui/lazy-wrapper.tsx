"use client";

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
  </div>
);

export const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const createLazyComponent = (importFn: () => Promise<any>) => 
  lazy(importFn);