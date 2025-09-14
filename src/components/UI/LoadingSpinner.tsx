import React from 'react';
import styled from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const SpinnerContainer = styled.div<{ $fullScreen: boolean; $size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  
  ${props => props.$fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    z-index: 10000;
  `}
`;

const Spinner = styled.div<{ $size: string; $color: string }>`
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${props => props.$color};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return 'width: 20px; height: 20px; border-width: 2px;';
      case 'md':
        return 'width: 40px; height: 40px; border-width: 4px;';
      case 'lg':
        return 'width: 60px; height: 60px; border-width: 6px;';
      default:
        return 'width: 40px; height: 40px; border-width: 4px;';
    }
  }}

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #667eea;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  text-align: center;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#667eea',
  text = 'جاري التحميل...',
  fullScreen = false
}) => {
  return (
    <SpinnerContainer $fullScreen={fullScreen} $size={size}>
      <Spinner $size={size} $color={color} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
