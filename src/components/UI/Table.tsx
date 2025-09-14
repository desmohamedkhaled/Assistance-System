import styled from 'styled-components';
import { TableColumn } from '@/types';

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

const TableContainer = styled.div`
  overflow-x: auto;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(10px);
  animation: slideInUp 0.6s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--primary-gradient);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--transition-normal);
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  background: var(--light-gray);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableHeaderCell = styled.th`
  padding: var(--space-md) var(--space-sm);
  text-align: right;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--gray-200);
  white-space: nowrap;
  background: var(--light-gray);
  position: relative;
  transition: all var(--transition-normal);

  &:hover {
    background: var(--gray-100);
    color: var(--primary-color);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-gradient);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--transition-normal);
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ $clickable?: boolean }>`
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all var(--transition-normal);
  position: relative;
  animation: slideInRight 0.3s ease-out;

  &:hover {
    background-color: var(--light-gray);
    transform: translateX(-2px);
    box-shadow: var(--shadow-sm);
  }

  &:nth-child(even) {
    background-color: rgba(102, 126, 234, 0.02);
  }

  &:nth-child(even):hover {
    background-color: var(--light-gray);
  }
`;

const TableCell = styled.td`
  padding: var(--space-md);
  border-bottom: 1px solid var(--gray-200);
  text-align: right;
  transition: all var(--transition-normal);
  position: relative;

  &:hover {
    color: var(--primary-color);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  color: var(--primary-color);
  animation: fadeIn 0.6s ease-out;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin-left: var(--space-sm);

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  color: var(--text-secondary);
  animation: fadeIn 0.6s ease-out;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  color: var(--gray-300);
  margin-bottom: var(--space-md);
  animation: float 3s ease-in-out infinite;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin: 0;
  color: var(--text-secondary);
`;

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'لا توجد بيانات',
  onRowClick,
  className
}: TableProps<T>) {
  if (loading) {
    return (
      <TableContainer className={className}>
        <LoadingContainer>
          <LoadingSpinner />
          جاري التحميل...
        </LoadingContainer>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer className={className}>
        <EmptyState>
          <EmptyStateIcon>
            <i className="fas fa-inbox"></i>
          </EmptyStateIcon>
          <EmptyStateText>{emptyMessage}</EmptyStateText>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer className={className}>
      <Table>
        <TableHeader>
          <tr>
            {columns.map((column, index) => (
              <TableHeaderCell key={index}>
                {column.label}
              </TableHeaderCell>
            ))}
          </tr>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              $clickable={!!onRowClick}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
