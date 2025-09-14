import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Enhanced Loading Spinner Component
 * 
 * A versatile loading spinner with multiple sizes, colors, and display options.
 * Features smooth animations and customizable appearance.
 * 
 * Features:
 * - Multiple sizes (sm, md, lg, xl)
 * - Multiple color variants
 * - Optional loading text
 * - Full screen overlay option
 * - Smooth animations
 * - Accessibility support
 * - RTL support for Arabic content
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text = 'جاري التحميل...',
  fullScreen = false,
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
    xl: 'w-20 h-20 border-6'
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-500',
    secondary: 'border-gray-200 border-t-secondary-500',
    success: 'border-gray-200 border-t-success-500',
    danger: 'border-gray-200 border-t-danger-500',
    warning: 'border-gray-200 border-t-warning-500',
    info: 'border-gray-200 border-t-info-500'
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const containerClasses = `
    flex flex-col items-center justify-center
    ${fullScreen ? 'fixed inset-0 bg-white/90  z-50' : ''}
    ${className}
  `;

  const spinnerClasses = `
    ${sizeClasses[size]}
    ${colorClasses[color]}
    rounded-full animate-spin
  `;

  const textClasses = `
    ${textSizeClasses[size]}
    font-medium text-gray-600 mt-4 text-center
  `;

  return (
    <div className={containerClasses}>
      {/* Spinner */}
      <div className={spinnerClasses} />
      
      {/* Loading text */}
      {text && (
        <p className={textClasses}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;