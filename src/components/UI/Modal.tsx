import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: var(--z-modal);
  align-items: center;
  justify-content: center;
  animation: ${props => props.$isOpen ? 'fadeIn 0.3s ease' : 'fadeOut 0.3s ease'};
  padding: var(--space-lg);

  @keyframes fadeIn {
    from { 
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to { 
      opacity: 1;
      backdrop-filter: blur(8px);
    }
  }

  @keyframes fadeOut {
    from { 
      opacity: 1;
      backdrop-filter: blur(8px);
    }
    to { 
      opacity: 0;
      backdrop-filter: blur(0px);
    }
  }
`;

const ModalContent = styled.div<{ $size: string }>`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: ${props => {
    switch (props.$size) {
      case 'sm': return '400px';
      case 'md': return '600px';
      case 'lg': return '800px';
      case 'xl': return '1200px';
      default: return '600px';
    }
  }};
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: zoomIn 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(20px);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--primary-gradient);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
`;

const ModalHeader = styled.div`
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(102, 126, 234, 0.02);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);

  &:hover {
    background-color: var(--light-gray);
    color: var(--danger-color);
    transform: scale(1.1) rotate(90deg);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: var(--space-xl);
  animation: slideInUp 0.3s ease-out;
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent $size={size} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {showCloseButton && (
              <CloseButton onClick={onClose}>
                <i className="fas fa-times"></i>
              </CloseButton>
            )}
          </ModalHeader>
        )}
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;
