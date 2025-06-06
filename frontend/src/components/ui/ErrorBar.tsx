import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdCloseCircle } from "react-icons/io";

interface ErrorBarProps {
    message?: string;
    onClose: () => void;
    duration?: number;
}

const ErrorBar: React.FC<ErrorBarProps> = ({message, onClose, duration=3000}) => {
    useEffect(() => {
        if(!message) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [message, onClose, duration]);

    if (!message) return null;
  return (
    <AnimatePresence>
        <motion.div 
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-down"
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

export default ErrorBar