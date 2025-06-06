import { cva, type VariantProps } from 'class-variance-authority';
// import { cn } from '../../lib/utils';
import { cn } from '@/lib/utils';
import type React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-2xl text-md font-semibold focus:outline-none disabled:opacity-50 disabled:pointer-events-none transition duration-300 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-50',
        icon: 'bg-gray-200 hover:bg-gray-50 text-gray-500 text-4xl',
        destructive: 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:bg-green-700 focus:ring-green-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};