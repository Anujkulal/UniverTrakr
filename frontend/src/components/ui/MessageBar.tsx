import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdCloseCircle } from "react-icons/io";
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface MessageBarProps {
    message?: string;
    onClose: () => void;
    duration?: number;
    variant?: 'default' | 'success' | 'error';
    className?: string;
}

const messageBarVariants = cva(
    "fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-down",
    {
        variants: {
            variant: {
                default: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:bg-blue-700',
                success: 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:bg-green-700 focus:ring-green-500',
                error: 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:bg-red-700 focus:ring-red-500',
            }
        },
        defaultVariants: {
            variant: 'default',
        }    
    }
)

const MessageBar: React.FC<MessageBarProps> = ({message, variant, className, onClose, duration=3000}) => {
    useEffect(() => {
        if(!message) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [message, onClose, duration]);

    if (!message) return null;
  return (
    <AnimatePresence>
        <motion.div 
        className={cn(messageBarVariants({ variant }), className)}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
        >
        <span className='font-semibold'>{message}</span>
        <button
            className="ml-4 text-white font-bold cursor-pointer"
            onClick={onClose}
            aria-label="Close"
        >
            <IoMdCloseCircle size={24} />
        </button>
        </motion.div>
    </AnimatePresence>
  )
}

export default MessageBar;