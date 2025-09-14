import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Enhanced Button Component
 * 
 * A versatile button component with multiple variants and sizes.
 * Features smooth animations, loading states, and accessibility support.
 * 
 * Features:
 * - Multiple color variants (primary, secondary, success, danger, warning, info, outline)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Full width option
 * - Smooth hover animations
 * - Accessibility support
 * - RTL support for Arabic content
 */
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  loading = false, 
  children, 
  disabled,
  className = '',
  ...props 
}) => {
  // Base button classes
  const baseClasses = `
    inline-flex items-center justify-center font-medium text-sm transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden     ${fullWidth ? 'w-full' : ''}
    ${loading ? 'pointer-events-none opacity-70' : ''}
    group
  `;

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px] rounded-lg',
    md: 'px-6 py-3 text-sm min-h-[48px] rounded-xl',
    lg: 'px-8 py-4 text-base min-h-[56px] rounded-xl'
  };

  // Variant classes
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600 text-white 
      hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 
      shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105
      border border-primary-200
    `,
    secondary: `
      bg-gradient-to-r from-secondary-500 to-secondary-600 text-white 
      hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500 
      shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105
      border border-secondary-200
    `,
    success: `
      bg-gradient-to-r from-success-500 to-success-600 text-white 
      hover:from-success-600 hover:to-success-700 focus:ring-success-500 
      shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105
      border border-success-200
    `,
    danger: `
      bg-gradient-to-r from-danger-500 to-danger-600 text-white 
      hover:from-danger-600 hover:to-danger-700 focus:ring-danger-500 
      shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105
      border border-danger-200
    `,
    warning: `
      bg-gradient-to-r from-warning-500 to-warning-600 text-gray-800 
      hover:from-warning-600 hover:to-warning-700 focus:ring-warning-500 
      shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105
      border border-warning-200
    `,
    info: `
      bg-gradient-to-r from-info-500 to-info-600 text-white 
      hover:from-info-600 hover:to-info-700 focus:ring-info-500 
      shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105
      border border-info-200
    `,
    outline: `
      border-2 border-primary-500 bg-transparent text-primary-600 
      hover:bg-primary-500 hover:text-white focus:ring-primary-500
      shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105
    `
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin mr-2" />
  );

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...(props as any)}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading && <LoadingSpinner />}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;