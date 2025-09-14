import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const ButtonBase = styled.button<ButtonProps>`
  padding: 12px 20px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 2px;
  text-align: center;
  min-height: 44px;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => props.size === 'sm' && css`
    padding: 6px 12px;
    font-size: 12px;
    min-height: 32px;
  `}

  ${props => props.size === 'lg' && css`
    padding: 16px 24px;
    font-size: 16px;
    min-height: 52px;
  `}

  ${props => props.loading && css`
    pointer-events: none;
    opacity: 0.7;
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background: var(--primary-gradient);
  color: var(--white);
  box-shadow: var(--shadow-primary);
  border: 1px solid rgba(102, 126, 234, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.05);
    box-shadow: var(--shadow-primary-lg);
    border-color: rgba(102, 126, 234, 0.3);
    animation: pulse 0.6s ease-in-out;
  }

  &:active:not(:disabled) {
    transform: translateY(-1px) scale(1.02);
    box-shadow: var(--shadow-primary);
  }

  &::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: var(--secondary-color);
  color: var(--white);
  border: 1px solid rgba(108, 117, 125, 0.2);

  &:hover:not(:disabled) {
    background: var(--secondary-dark);
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--shadow-md);
    border-color: rgba(108, 117, 125, 0.3);
  }
`;

const SuccessButton = styled(ButtonBase)`
  background: var(--success-color);
  color: var(--white);
  border: 1px solid rgba(40, 167, 69, 0.2);

  &:hover:not(:disabled) {
    background: var(--success-dark);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
    border-color: rgba(40, 167, 69, 0.3);
  }
`;

const DangerButton = styled(ButtonBase)`
  background: var(--danger-color);
  color: var(--white);
  border: 1px solid rgba(220, 53, 69, 0.2);

  &:hover:not(:disabled) {
    background: var(--danger-dark);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
    border-color: rgba(220, 53, 69, 0.3);
  }
`;

const WarningButton = styled(ButtonBase)`
  background: var(--warning-color);
  color: var(--gray-800);
  border: 1px solid rgba(255, 193, 7, 0.2);

  &:hover:not(:disabled) {
    background: var(--warning-dark);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
    border-color: rgba(255, 193, 7, 0.3);
  }
`;

const InfoButton = styled(ButtonBase)`
  background: var(--info-color);
  color: var(--white);
  border: 1px solid rgba(23, 162, 184, 0.2);

  &:hover:not(:disabled) {
    background: var(--info-dark);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(23, 162, 184, 0.3);
    border-color: rgba(23, 162, 184, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  loading = false, 
  children, 
  disabled,
  ...props 
}) => {
  const ButtonComponent = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    success: SuccessButton,
    danger: DangerButton,
    warning: WarningButton,
    info: InfoButton
  }[variant];

  return (
    <ButtonComponent
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </ButtonComponent>
  );
};

export default Button;
