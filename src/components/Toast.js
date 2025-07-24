import React from 'react';
import { X, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const bgColor = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    warning: 'bg-amber-600',
    info: 'bg-blue-600'
  }[toast.type];

  const icon = {
    success: <CheckCircle size={16} />,
    error: <AlertCircle size={16} />,
    warning: <AlertCircle size={16} />,
    info: <MessageSquare size={16} />
  }[toast.type];

  return (
    <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center justify-between min-w-96 border-l-4 border-white/20 animate-slide-in`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{toast.message}</span>
      </div>
      <button onClick={() => onRemove(toast.id)} className="ml-3 hover:bg-white/10 p-1 rounded">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;