import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  className = '',
}) => {
  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};