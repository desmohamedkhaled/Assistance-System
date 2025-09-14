import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styled from 'styled-components';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: var(--primary-gradient);
  color: var(--white);
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform var(--transition-normal);
  z-index: var(--z-modal);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${props => props.$isOpen ? 'slideInFromRight' : 'slideOutToRight'} 0.3s ease-out;
`;

const SidebarHeader = styled.div`
  padding: var(--space-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--white);
  font-size: 20px;
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1) rotate(90deg);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

const SidebarNav = styled.nav`
  padding: 12px 0;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  color: var(--white);
  text-decoration: none;
  transition: all var(--transition-normal);
  border-right: 3px solid transparent;
  margin: 2px 0;
  background-color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border-right-color: ${props => props.$isActive ? '#ffd700' : 'transparent'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left var(--transition-slow);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-right-color: #ffd700;
    transform: translateX(-4px) scale(1.02);
  }

  &:hover::before {
    left: 100%;
  }

  i {
    margin-left: var(--space-md);
    width: 20px;
    text-align: center;
    font-size: 14px;
    transition: transform var(--transition-normal);
  }

  &:hover i {
    transform: scale(1.2);
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Remove unused variables

  const navigationItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: 'fas fa-tachometer-alt', roles: ['admin', 'branch_manager', 'staff', 'approver', 'beneficiary'] },
    { path: '/request-assistance', label: 'طلب مساعدة', icon: 'fas fa-file-plus', roles: ['staff', 'beneficiary'] },
    { path: '/my-requests', label: 'طلباتي', icon: 'fas fa-list', roles: ['beneficiary'] },
    { path: '/admin-requests', label: 'إدارة الطلبات', icon: 'fas fa-clipboard-check', roles: ['admin', 'branch_manager', 'approver'] },
    { path: '/beneficiaries', label: 'المستفيدين', icon: 'fas fa-users', roles: ['admin', 'branch_manager', 'staff'] },
    { path: '/assistances', label: 'المساعدات', icon: 'fas fa-hand-holding-heart', roles: ['admin', 'branch_manager', 'staff'] },
    { path: '/aid-files', label: 'ملفات المساعدات', icon: 'fas fa-file-alt', roles: ['admin', 'branch_manager'] },
    { path: '/organizations', label: 'المؤسسات', icon: 'fas fa-building', roles: ['admin', 'branch_manager'] },
    { path: '/projects', label: 'المشاريع', icon: 'fas fa-project-diagram', roles: ['admin', 'branch_manager'] },
    { path: '/reports', label: 'التقارير', icon: 'fas fa-chart-bar', roles: ['admin', 'branch_manager'] },
    { path: '/users', label: 'إدارة المستخدمين', icon: 'fas fa-user-cog', roles: ['admin'] },
    { path: '/branches', label: 'الفروع', icon: 'fas fa-building', roles: ['admin'] },
    { path: '/settings', label: 'الإعدادات', icon: 'fas fa-cog', roles: ['admin', 'branch_manager'] }
  ];

  const filteredNavigationItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <SidebarTitle>
          <i className="fas fa-hands-helping"></i>
          نظام إدارة المساعدات
        </SidebarTitle>
        <CloseButton onClick={onClose}>
          <i className="fas fa-times"></i>
        </CloseButton>
      </SidebarHeader>
      <SidebarNav>
        {filteredNavigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            $isActive={location.pathname === item.path}
            onClick={onClose}
          >
            <i className={item.icon}></i>
            {item.label}
          </NavLink>
        ))}
      </SidebarNav>
    </SidebarContainer>
  );
};

export default Sidebar;
