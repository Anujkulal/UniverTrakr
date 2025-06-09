import React from 'react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>
& {
  label?: string;
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, className, ...props }, ref) => {
  
  return (
    <div>
        <label className="block text-gray-700 font-semibold mb-1" htmlFor={props.id || props.name}>
            {label || ""}
        </label>
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border font-medium border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400',
            className
          )}
          {...props}
        />
    </div>
  );
});

// Forward ref to allow parent components to access the input element directly
Input.displayName = 'Input';