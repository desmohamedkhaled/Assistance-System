import React from 'react';
import { useAuth } from '@/context/AuthContext';
import styled from 'styled-components';

interface HeaderProps {
  onMenuClick: () => void;
}

const HeaderContainer = styled.header`
  background: var(--bg-primary);
  padding: var(--space-md) var(--space-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  margin-bottom: 0;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  animation: slideInFromTop 0.6s ease-out;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  color: var(--text-primary);

  &:hover {
    background-color: var(--light-gray);
    transform: scale(1.1);
    color: var(--primary-color);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(102, 126, 234, 0.2);
  box-shadow: var(--shadow-primary);
  transition: all var(--transition-normal);
  animation: float 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: var(--shadow-primary-lg);
  }
`;

const LogoImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const SystemInfo = styled.div`
  h1 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: glow 2s ease-in-out infinite;
  }

  p {
    font-size: 11px;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 500;
    transition: color var(--transition-normal);
  }

  &:hover p {
    color: var(--primary-color);
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-weight: 500;
  }

  i {
    font-size: 24px;
    color: #667eea;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);

  &:hover {
    background-color: rgba(220, 53, 69, 0.1);
    transform: scale(1.1);
    color: var(--danger-dark);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <NavLeft>
        <MenuButton onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </MenuButton>
        <LogoSection>
          <Logo>
            <LogoImage src="/NSB.png" alt="لوجو النظام" />
          </Logo>
          <SystemInfo>
            <h1>نظام إدارة المساعدات</h1>
            <p>Assistance Management System (AMS)</p>
          </SystemInfo>
        </LogoSection>
      </NavLeft>
      <NavRight>
        <UserProfile>
          <span>{user?.fullName || 'مستخدم'}</span>
          <i className="fas fa-user-circle"></i>
          <LogoutButton onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </LogoutButton>
        </UserProfile>
      </NavRight>
    </HeaderContainer>
  );
};

export default Header;
