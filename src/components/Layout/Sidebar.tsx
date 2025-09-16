import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar Navigation Component
 * 
 * Provides the main navigation sidebar for the application including:
 * - Role-based navigation items
 * - Active state highlighting
 * - Responsive design with mobile support
 * - Smooth animations and transitions
 * 
 * Features:
 * - Dynamic navigation based on user role
 * - Active page highlighting
 * - Mobile-friendly overlay design
 * - RTL support for Arabic content
 * - Accessible navigation structure
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Navigation items with role-based access control
  const navigationItems = [
    { 
      path: '/dashboard', 
      label: 'لوحة التحكم', 
      icon: 'fas fa-tachometer-alt', 
      roles: ['admin', 'branch_manager', 'staff', 'approver', 'beneficiary'] 
    },
    { 
      path: '/request-assistance', 
      label: 'طلب مساعدة', 
      icon: 'fas fa-file-plus', 
      roles: ['staff', 'beneficiary'] 
    },
    { 
      path: '/my-requests', 
      label: 'طلباتي', 
      icon: 'fas fa-list', 
      roles: ['beneficiary'] 
    },
    { 
      path: '/admin-requests', 
      label: 'إدارة الطلبات', 
      icon: 'fas fa-clipboard-check', 
      roles: ['admin', 'branch_manager', 'approver'] 
    },
    { 
      path: '/beneficiaries', 
      label: 'المستفيدين', 
      icon: 'fas fa-users', 
      roles: ['admin', 'branch_manager', 'staff'] 
    },
    { 
      path: '/assistances', 
      label: 'المساعدات', 
      icon: 'fas fa-hand-holding-heart', 
      roles: ['admin', 'branch_manager', 'staff'] 
    },
    { 
      path: '/aid-files', 
      label: 'ملفات المساعدات', 
      icon: 'fas fa-file-alt', 
      roles: ['admin', 'branch_manager'] 
    },
    { 
      path: '/organizations', 
      label: 'المؤسسات', 
      icon: 'fas fa-building', 
      roles: ['admin', 'branch_manager'] 
    },
    { 
      path: '/projects', 
      label: 'المشاريع', 
      icon: 'fas fa-project-diagram', 
      roles: ['admin', 'branch_manager'] 
    },
    { 
      path: '/reports', 
      label: 'التقارير', 
      icon: 'fas fa-chart-bar', 
      roles: ['admin', 'branch_manager'] 
    },
    { 
      path: '/users', 
      label: 'إدارة المستخدمين', 
      icon: 'fas fa-user-cog', 
      roles: ['admin'] 
    },
    { 
      path: '/branches', 
      label: 'الفروع', 
      icon: 'fas fa-building', 
      roles: ['admin'] 
    },
    { 
      path: '/settings', 
      label: 'الإعدادات', 
      icon: 'fas fa-cog', 
      roles: ['admin', 'branch_manager'] 
    },
    { 
      path: '/profile', 
      label: 'الملف الشخصي', 
      icon: 'fas fa-user', 
      roles: ['admin', 'branch_manager', 'staff', 'approver', 'beneficiary'] 
    },
    { 
      path: '/help', 
      label: 'المساعدة والدعم', 
      icon: 'fas fa-question-circle', 
      roles: ['admin', 'branch_manager', 'staff', 'approver', 'beneficiary'] 
    }
  ];

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed top-0 right-0 w-80 h-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-5xl  border-l border-white/10 z-50"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 bg-white/5 ">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                <img 
                  src="/NSB.png" 
                  alt="لوجو NSB" 
                  className="w-6 h-6 rounded-lg object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h2 className="text-lg font-semibold flex items-center gap-3">
                <i className="fas fa-hands-helping text-warning-300 text-xl"></i>
                نظام إدارة المساعدات
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="إغلاق القائمة"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-4">
          {filteredNavigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-6 py-4 mx-2 my-1 text-white no-underline
                    transition-all duration-300 rounded-xl relative overflow-hidden
                    border-r-4 border-transparent
                    ${isActive 
                      ? 'bg-white/20 border-warning-400 shadow-xl' 
                      : 'hover:bg-white/10 hover:border-warning-300'
                    }
                    hover:translate-x-1 hover:scale-[1.02]
                    group
                  `}
                  style={{ gap: '0.75rem' }}
                >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                {/* Icon */}
                <i className={`
                  ${item.icon} text-lg w-6 text-center transition-transform duration-300
                  group-hover:scale-125
                  ${isActive ? 'text-warning-300' : 'text-white/80'}
                `}></i>
                
                {/* Label */}
                <span className="font-medium text-sm flex-1">
                  {item.label}
                </span>
                
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="w-2 h-2 bg-warning-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-white/5">
          <div className="text-center">
            <p className="text-white/70 text-xs">
              © 2024 نظام إدارة المساعدات
            </p>
            <p className="text-white/50 text-xs mt-1">
              جميع الحقوق محفوظة
            </p>
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
