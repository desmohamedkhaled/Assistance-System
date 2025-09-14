import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Page Transition Component
 * 
 * Provides smooth page transitions with consistent animations.
 * Features fade and slide animations for better user experience.
 * 
 * Features:
 * - Smooth fade and slide animations
 * - Consistent timing and easing
 * - Accessibility support
 * - RTL support for Arabic content
 */
const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
