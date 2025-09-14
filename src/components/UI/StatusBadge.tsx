import React from 'react';

interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Enhanced Status Badge Component
 * 
 * A versatile status badge component with predefined color schemes for different statuses.
 * Features smooth animations and consistent styling across the application.
 * 
 * Features:
 * - Multiple predefined status colors
 * - Three sizes (sm, md, lg)
 * - Smooth hover animations
 * - Consistent styling
 * - Accessibility support
 * - RTL support for Arabic content
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  className = '',
  size = 'md'
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-w-[70px] rounded-full',
    md: 'px-4 py-2 text-sm min-w-[90px] rounded-full',
    lg: 'px-5 py-2.5 text-base min-w-[110px] rounded-full'
  };

  // Status color mapping
  const getStatusClasses = (status: string) => {
    const statusMap: Record<string, string> = {
      // Payment statuses
      'مدفوع': 'bg-success-100 text-success-800 border-success-200',
      'غير مدفوع': 'bg-danger-100 text-danger-800 border-danger-200',
      
      // Approval statuses
      'معتمد': 'bg-primary-100 text-primary-800 border-primary-200',
      'معلق': 'bg-warning-100 text-warning-800 border-warning-200',
      'مرفوض': 'bg-danger-100 text-danger-800 border-danger-200',
      'قيد المراجعة': 'bg-info-100 text-info-800 border-info-200',
      
      // General statuses
      'نشط': 'bg-success-100 text-success-800 border-success-200',
      'غير نشط': 'bg-gray-100 text-gray-800 border-gray-200',
      'مكتمل': 'bg-primary-100 text-primary-800 border-primary-200',
      'قيد التنفيذ': 'bg-warning-100 text-warning-800 border-warning-200',
      'متوقف': 'bg-danger-100 text-danger-800 border-danger-200',
      
      // User roles
      'admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'user': 'bg-success-100 text-success-800 border-success-200',
      'bank_employee': 'bg-blue-100 text-blue-800 border-blue-200',
      'beneficiary': 'bg-green-100 text-green-800 border-green-200',
      
      // Priority levels
      'عالي': 'bg-danger-100 text-danger-800 border-danger-200',
      'متوسط': 'bg-warning-100 text-warning-800 border-warning-200',
      'منخفض': 'bg-success-100 text-success-800 border-success-200',
      
      // Default
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return statusMap[status] || statusMap['default'];
  };

  const badgeClasses = `
    inline-flex items-center justify-center font-semibold border
    transition-all duration-200 hover:scale-105 hover:shadow-md
    ${sizeClasses[size]}
    ${getStatusClasses(status)}
    ${className}
  `;

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default StatusBadge;