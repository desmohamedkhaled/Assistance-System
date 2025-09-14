import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Modal from './Modal';

const ExportContainer = styled.div`
  position: relative;
`;

const ExportMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;
`;

const ExportMenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: right;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #f8f9fa;
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  i {
    color: #667eea;
    width: 16px;
  }
`;

const ExportModal = styled(Modal)`
  .modal-content {
    max-width: 500px;
  }
`;

const ExportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const ExportOption = styled.button<{ $selected: boolean }>`
  padding: 16px;
  border: 2px solid ${props => props.$selected ? '#667eea' : '#e9ecef'};
  border-radius: 8px;
  background: ${props => props.$selected ? 'rgba(102, 126, 234, 0.1)' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  i {
    font-size: 24px;
    color: #667eea;
    margin-bottom: 8px;
    display: block;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
`;

const DateRangeContainer = styled.div`
  margin-bottom: 20px;
`;

const DateRangeLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const DateInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  direction: ltr;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel', options?: any) => void;
  loading?: boolean;
  dataType?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  onExport, 
  loading = false, 
  dataType = 'البيانات' 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf' || format === 'excel') {
      setSelectedFormat(format);
      setShowModal(true);
    } else {
      onExport(format, { dateRange });
    }
    setShowMenu(false);
  };

  const handleConfirmExport = () => {
    onExport(selectedFormat, { dateRange });
    setShowModal(false);
  };

  const formatOptions = [
    { key: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf' },
    { key: 'excel', label: 'Excel', icon: 'fas fa-file-excel' }
  ];

  return (
    <ExportContainer>
      <Button
        variant="secondary"
        onClick={() => setShowMenu(!showMenu)}
        loading={loading}
      >
        <i className="fas fa-download"></i>
        تصدير {dataType}
      </Button>

      {showMenu && (
        <>
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 999 
            }} 
            onClick={() => setShowMenu(false)}
          />
          <ExportMenu>
            <ExportMenuItem onClick={() => handleExport('pdf')}>
              <i className="fas fa-file-pdf"></i>
              تصدير PDF
            </ExportMenuItem>
            <ExportMenuItem onClick={() => handleExport('excel')}>
              <i className="fas fa-file-excel"></i>
              تصدير Excel
            </ExportMenuItem>
            <ExportMenuItem onClick={() => handleExport('both')}>
              <i className="fas fa-cog"></i>
              خيارات متقدمة
            </ExportMenuItem>
          </ExportMenu>
        </>
      )}

      <ExportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="خيارات التصدير"
        size="md"
      >
        <ExportOptions>
          {formatOptions.map(option => (
            <ExportOption
              key={option.key}
              $selected={selectedFormat === option.key}
              onClick={() => setSelectedFormat(option.key as 'pdf' | 'excel')}
            >
              <i className={option.icon}></i>
              <span>{option.label}</span>
            </ExportOption>
          ))}
        </ExportOptions>

        <DateRangeContainer>
          <DateRangeLabel>نطاق التاريخ (اختياري)</DateRangeLabel>
          <DateInputs>
            <DateInput
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              placeholder="من تاريخ"
            />
            <DateInput
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              placeholder="إلى تاريخ"
            />
          </DateInputs>
        </DateRangeContainer>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmExport}
          >
            <i className={`fas ${selectedFormat === 'pdf' ? 'fa-file-pdf' : 'fa-file-excel'}`}></i>
            تصدير {selectedFormat === 'pdf' ? 'PDF' : 'Excel'}
          </Button>
        </div>
      </ExportModal>
    </ExportContainer>
  );
};

export default ExportButton;
