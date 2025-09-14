import React from 'react';
import styled, { css } from 'styled-components';

interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
  className?: string;
}

const Badge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  min-width: 80px;
  border: 1px solid;

  ${props => {
    switch (props.$status) {
      case 'مدفوع':
        return css`
          background: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        `;
      case 'معتمد':
        return css`
          background: #cce5ff;
          color: #004085;
          border-color: #b3d7ff;
        `;
      case 'معلق':
        return css`
          background: #fff3cd;
          color: #856404;
          border-color: #ffeaa7;
        `;
      case 'مرفوض':
        return css`
          background: #f8d7da;
          color: #721c24;
          border-color: #f5c6cb;
        `;
      case 'قيد المراجعة':
        return css`
          background: #d1ecf1;
          color: #0c5460;
          border-color: #bee5eb;
        `;
      case 'نشط':
        return css`
          background: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        `;
      case 'مكتمل':
        return css`
          background: #cce5ff;
          color: #004085;
          border-color: #b3d7ff;
        `;
      case 'قيد التنفيذ':
        return css`
          background: #fff3cd;
          color: #856404;
          border-color: #ffeaa7;
        `;
      case 'admin':
        return css`
          background: #d1ecf1;
          color: #0c5460;
          border-color: #bee5eb;
        `;
      case 'user':
        return css`
          background: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        `;
      case 'bank_employee':
        return css`
          background: #e2e3e5;
          color: #383d41;
          border-color: #d6d8db;
        `;
      default:
        return css`
          background: #f8f9fa;
          color: #6c757d;
          border-color: #dee2e6;
        `;
    }
  }}
`;

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children, className }) => {
  return (
    <Badge $status={status} className={className}>
      {children}
    </Badge>
  );
};

export default StatusBadge;
