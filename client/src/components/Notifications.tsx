import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'error' | 'success';
  title: string;
  message: string;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ 
  type, 
  title, 
  message, 
  onClose 
}) => {
  const isError = type === 'error';
  
  return (
    <div 
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 scale-in max-w-md ${
        isError 
          ? 'bg-destructive text-destructive-foreground' 
          : 'bg-accent text-accent-foreground'
      }`}
      data-testid={`notification-${type}`}
    >
      <div className="flex items-start space-x-3">
        {isError ? (
          <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
        ) : (
          <CheckCircle className="mt-0.5 flex-shrink-0" size={20} />
        )}
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`flex-shrink-0 ${
            isError 
              ? 'text-destructive-foreground hover:text-destructive-foreground/80' 
              : 'text-accent-foreground hover:text-accent-foreground/80'
          }`}
          data-testid={`button-close-${type}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
