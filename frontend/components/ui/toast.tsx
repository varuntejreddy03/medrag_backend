"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

let toastId = 0;
const toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

export const toast = {
  success: (message: string, duration = 3000) => {
    addToast({ type: 'success', message, duration });
  },
  error: (message: string, duration = 4000) => {
    addToast({ type: 'error', message, duration });
  },
  info: (message: string, duration = 3000) => {
    addToast({ type: 'info', message, duration });
  }
};

function addToast(toast: Omit<Toast, 'id'>) {
  const newToast = { ...toast, id: (++toastId).toString() };
  toasts.push(newToast);
  notifyListeners();
  
  setTimeout(() => {
    removeToast(newToast.id);
  }, toast.duration);
}

function removeToast(id: string) {
  const index = toasts.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    notifyListeners();
  }
}

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

export const ToastContainer = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToastList(newToasts);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'info': return <AlertCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'error': return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'info': return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toastList.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-lg ${getColors(toast.type)} min-w-80 max-w-md`}
          >
            {getIcon(toast.type)}
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};