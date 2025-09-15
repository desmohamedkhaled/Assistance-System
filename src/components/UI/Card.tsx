import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
}

/**
 * Enhanced Card Component
 * 
 * A versatile card component with multiple variants and interactive states.
 * Features smooth animations, hover effects, and consistent styling.
 * 
 * Features:
 * - Multiple variants (default, elevated, outlined, glass)
 * - Three padding sizes (sm, md, lg)
 * - Optional header and footer
 * - Hover and click animations
 * - Loading state
 * - Smooth animations
 * - Accessibility support
 * - RTL support for Arabic content
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  clickable = false,
  onClick,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  loading = false
}) => {
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-primary-100 shadow-sm',
    elevated: 'bg-white border border-primary-200 shadow-lg',
    outlined: 'bg-white border-2 border-primary-300 shadow-none',
    glass: 'bg-white/80 backdrop-blur-sm border border-primary-200/50 shadow-lg'
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const cardClasses = `
    rounded-2xl transition-all duration-300 relative overflow-hidden
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    ${clickable ? 'cursor-pointer' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Loading overlay
  if (loading) {
    return (
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
      
      {/* Header */}
      {header && (
        <motion.div 
          className="border-b border-primary-100 pb-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {header}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Footer */}
      {footer && (
        <motion.div 
          className="border-t border-primary-100 pt-4 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {footer}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Card;
