
import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed top-24 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg border ${bgColors[type]} transition-all animate-fade-in-down min-w-[300px]`}>
      <div className="flex-shrink-0 mr-3">
        {icons[type]}
      </div>
      <div className="flex-1 text-sm font-medium text-slate-800">
        {message}
      </div>
      <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
