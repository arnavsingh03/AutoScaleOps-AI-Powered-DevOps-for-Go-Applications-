import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={`
            block w-full rounded-md border border-gray-300 px-3 py-2
            shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);