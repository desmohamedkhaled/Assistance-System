import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel', options?: Record<string, unknown>) => void;
  loading?: boolean;
  dataType?: string;
  className?: string;
}

/**
 * Enhanced Export Button Component
 * 
 * A versatile export button with dropdown menu and advanced export options.
 * Features format selection, date range filtering, and smooth animations.
 * 
 * Features:
 * - Dropdown menu with export options
 * - PDF and Excel format support
 * - Date range filtering
 * - Advanced export options modal
 * - Loading states
 * - Smooth animations
 * - Accessibility support
 * - RTL support for Arabic content
 */
const ExportButton: React.FC<ExportButtonProps> = ({ 
  onExport, 
  loading = false, 
  dataType = 'البيانات',
  className = ''
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
    { key: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf', color: 'text-red-500' },
    { key: 'excel', label: 'Excel', icon: 'fas fa-file-excel', color: 'text-green-500' }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Export Button */}
      <Button
        variant="secondary"
        onClick={() => setShowMenu(!showMenu)}
        loading={loading}
        className="relative"
      >
        <i className="fas fa-download"></i>
        تصدير {dataType}
        <i className={`fas fa-chevron-down transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}></i>
      </Button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200/50  z-50 min-w-[200px] overflow-hidden animate-fade-in">
            <div className="py-2">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <i className="fas fa-file-pdf text-red-500 w-4"></i>
                تصدير PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <i className="fas fa-file-excel text-green-500 w-4"></i>
                تصدير Excel
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => handleExport('both')}
                className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <i className="fas fa-cog text-primary-500 w-4"></i>
                خيارات متقدمة
              </button>
            </div>
          </div>
        </>
      )}

      {/* Export Options Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="خيارات التصدير"
        size="md"
      >
        {/* Format Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">اختر تنسيق التصدير</h3>
          <div className="grid grid-cols-2 gap-4">
            {formatOptions.map(option => (
              <button
                key={option.key}
                onClick={() => setSelectedFormat(option.key as 'pdf' | 'excel')}
                className={`
                  p-4 border-2 rounded-xl transition-all duration-200 text-center
                  ${selectedFormat === option.key 
                    ? 'border-primary-500 bg-primary-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25'
                  }
                `}
              >
                <i className={`${option.icon} ${option.color} text-2xl mb-2 block`}></i>
                <span className="text-sm font-medium text-gray-700">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            نطاق التاريخ (اختياري)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">من تاريخ</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">إلى تاريخ</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end" style={{ gap: '0.75rem' }}>
          <Button
            variant="outline"
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
      </Modal>
    </div>
  );
};

export default ExportButton;