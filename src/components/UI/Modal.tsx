import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Enhanced Modal Component
 * 
 * A versatile modal component with multiple sizes and smooth animations.
 * Features keyboard navigation and accessibility support.
 * 
 * Features:
 * - Multiple sizes (sm, md, lg, xl)
 * - Smooth fade and zoom animations
 * - Keyboard navigation (ESC to close)
 * - Click outside to close
 * - Body scroll lock when open
 * - Accessibility support
 * - RTL support for Arabic content
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = ''
}) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-lg',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl'
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <motion.div 
            className={`
              relative bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto
              border border-gray-200/50               ${sizeClasses[size]}
            `}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
        {/* Top accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-3xl" />
        
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-primary-50/50 to-primary-100/30 rounded-t-3xl">
            <div className="flex justify-between items-center">
              {title && (
                <h3 
                  id="modal-title"
                  className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
                >
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-90"
                  aria-label="إغلاق النافذة"
                >
                  <i className="fas fa-times text-lg" />
                </button>
              )}
            </div>
          </div>
        )}
        
            {/* Body */}
            <motion.div 
              className="px-8 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;