import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Main Layout Component
 * 
 * Provides the main layout structure for the application including:
 * - Responsive sidebar navigation
 * - Header with user information and controls
 * - Main content area with proper spacing and responsive design
 * 
 * Features:
 * - Mobile-first responsive design
 * - Smooth transitions and animations
 * - Proper RTL support for Arabic content
 * - Accessible navigation structure
 */
const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content Area */}
      <div 
        className={`
          transition-all duration-300 ease-in-out min-h-screen
          ${sidebarOpen ? 'lg:mr-80' : 'mr-0'}
        `}
      >
        {/* Header Component */}
        <Header onMenuClick={toggleSidebar} />
        
        {/* Page Content */}
        <main className="min-h-[calc(100vh-120px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden "
            onClick={closeSidebar}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
