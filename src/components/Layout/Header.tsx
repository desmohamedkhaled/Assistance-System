import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Header Component
 * 
 * Provides the main header for the application including:
 * - Mobile menu toggle button
 * - System logo and branding
 * - User profile information and logout functionality
 * 
 * Features:
 * - Responsive design with mobile-first approach
 * - Smooth animations and hover effects
 * - RTL support for Arabic content
 * - Accessible navigation controls
 */
const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header 
      className="bg-white/95  shadow-lg border-b border-primary-100 sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Menu & Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <motion.button
              onClick={onMenuClick}
              className="p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="فتح القائمة"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <i className="fas fa-bars text-lg"></i>
            </motion.button>
            
            {/* Logo Section */}
            <div className="flex items-center gap-2">
              {/* Logo */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center border-2 border-primary-200 shadow-xl animate-float">
                <img 
                  src="/NSB.png" 
                  alt="لوجو NSB" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              {/* System Info */}
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 animate-glow">
                  نظام إدارة المساعدات
                </h1>
                <p className="text-sm sm:text-base text-gray-500 font-medium transition-colors duration-300 hover:text-primary-600">
                  Assistance Management System (AMS)
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - User Profile */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-semibold text-gray-700 hidden sm:block">
                {user?.fullName || 'مستخدم'}
              </span>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                <i className="fas fa-user text-primary-600 text-sm sm:text-base"></i>
              </div>
            </div>
            
            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="p-2 rounded-xl text-danger-500 hover:text-danger-600 hover:bg-danger-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
              aria-label="تسجيل الخروج"
              title="تسجيل الخروج"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <i className="fas fa-sign-out-alt text-sm sm:text-base"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
