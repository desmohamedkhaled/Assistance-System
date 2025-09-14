import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * Enhanced Input Component
 * 
 * A versatile input component with multiple variants, sizes, and states.
 * Features smooth animations, validation states, and accessibility support.
 * 
 * Features:
 * - Multiple variants (default, filled, outlined)
 * - Three sizes (sm, md, lg)
 * - Left and right icon support
 * - Error and helper text states
 * - Smooth animations
 * - Accessibility support
 * - RTL support for Arabic content
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: `
      border-2 border-gray-200 bg-white
      focus:border-primary-500 focus:ring-4 focus:ring-primary-100
      hover:border-primary-300
    `,
    filled: `
      border-2 border-transparent bg-gray-50
      focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white
      hover:bg-gray-100
    `,
    outlined: `
      border-2 border-gray-300 bg-transparent
      focus:border-primary-500 focus:ring-4 focus:ring-primary-100
      hover:border-primary-300
    `
  };

  // Error state classes
  const errorClasses = error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-100' : '';

  const inputClasses = `
    w-full rounded-xl transition-all duration-300
    text-right direction-rtl
    placeholder:text-gray-400
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${errorClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div 
      className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      {label && (
        <motion.label 
          className="text-sm font-semibold text-gray-700 text-right"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <motion.input
          ref={ref}
          className={inputClasses}
          style={{ paddingLeft: leftIcon ? '2.5rem' : undefined, paddingRight: rightIcon ? '2.5rem' : undefined }}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {error ? (
            <p className="text-sm text-danger-600 text-right flex items-center gap-1">
              <i className="fas fa-exclamation-circle text-xs" />
              {error}
            </p>
          ) : (
            <p className="text-sm text-gray-500 text-right">
              {helperText}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;
