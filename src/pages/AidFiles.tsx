import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { AidFile, TableColumn } from '@/types';
import { formatDate, formatFileSize } from '@/utils/format';
import DataTable from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import StatusBadge from '@/components/UI/StatusBadge';
import ExportButton from '@/components/UI/ExportButton';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
  font-weight: 600;
  text-align: right;
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  text-align: right;
`;

const PageActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
  direction: rtl;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  direction: rtl;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled.i`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
  text-align: right;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  font-size: 32px;
  color: ${props => props.$color};
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const FileTypeIcon = styled.div<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => {
    switch (props.$type) {
      case 'pdf': return '#dc3545';
      case 'doc': case 'docx': return '#007bff';
      case 'xls': case 'xlsx': return '#28a745';
      case 'jpg': case 'jpeg': case 'png': return '#ffc107';
      default: return '#6c757d';
    }
  }};
  color: white;
  font-size: 16px;
  margin-left: 8px;
`;

const AidFiles: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState<AidFile | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter files based on search term and filters
  const filteredFiles = useMemo(() => {
    let filtered = data.aidFiles;

    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(file => file.type === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(file => file.status === statusFilter);
    }

    return filtered;
  }, [data.aidFiles, searchTerm, typeFilter, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.aidFiles.length;
    const active = data.aidFiles.filter(f => f.status === 'active').length;
    const archived = data.aidFiles.filter(f => f.status === 'archived').length;
    const totalSize = data.aidFiles.reduce((sum, f) => sum + f.size, 0);

    return {
      total,
      active,
      archived,
      totalSize
    };
  }, [data.aidFiles]);

  const handleExport = (format: 'pdf' | 'excel', options?: any) => {
    toast('تصدير بيانات الملفات قيد التطوير', { icon: 'ℹ️' });
  };

  const handleRowClick = (file: AidFile) => {
    setSelectedFile(file);
    setShowDetailsModal(true);
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'fas fa-file-pdf';
      case 'doc': case 'docx': return 'fas fa-file-word';
      case 'xls': case 'xlsx': return 'fas fa-file-excel';
      case 'jpg': case 'jpeg': case 'png': return 'fas fa-file-image';
      default: return 'fas fa-file';
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'doc': return 'Word';
      case 'docx': return 'Word';
      case 'xls': return 'Excel';
      case 'xlsx': return 'Excel';
      case 'jpg': case 'jpeg': return 'صورة';
      case 'png': return 'صورة';
      default: return type.toUpperCase();
    }
  };

  const columns: TableColumn<AidFile>[] = [
    {
      key: 'name',
      label: 'اسم الملف',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FileTypeIcon $type={item.type}>
            <i className={getFileTypeIcon(item.type)}></i>
          </FileTypeIcon>
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'نوع الملف',
      render: (value) => getFileTypeLabel(value)
    },
    {
      key: 'size',
      label: 'حجم الملف',
      render: (value) => formatFileSize(value)
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <StatusBadge status={value}>{value === 'active' ? 'نشط' : 'مؤرشف'}</StatusBadge>
    },
    {
      key: 'uploadedBy',
      label: 'رفع بواسطة'
    },
    {
      key: 'uploadedAt',
      label: 'تاريخ الرفع',
      render: (value) => formatDate(value)
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>ملفات المساعدات</PageTitle>
        <PageSubtitle>إدارة الملفات والمستندات المتعلقة بالمساعدات</PageSubtitle>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon $color="#667eea">
            <i className="fas fa-folder"></i>
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>إجمالي الملفات</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#28a745">
            <i className="fas fa-check-circle"></i>
          </StatIcon>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>الملفات النشطة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#6c757d">
            <i className="fas fa-archive"></i>
          </StatIcon>
          <StatValue>{stats.archived}</StatValue>
          <StatLabel>الملفات المؤرشفة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-hdd"></i>
          </StatIcon>
          <StatValue>{formatFileSize(stats.totalSize)}</StatValue>
          <StatLabel>إجمالي الحجم</StatLabel>
        </StatCard>
      </StatsContainer>

      <PageActions>
        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="البحث باسم الملف أو الوصف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="fas fa-search"></SearchIcon>
          </SearchContainer>
          <FilterSelect
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            <option value="pdf">PDF</option>
            <option value="doc">Word</option>
            <option value="xls">Excel</option>
            <option value="jpg">صورة</option>
          </FilterSelect>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="archived">مؤرشف</option>
          </FilterSelect>
        </FiltersContainer>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary">
            <i className="fas fa-upload"></i>
            رفع ملف
          </Button>
          <ExportButton 
            onExport={handleExport} 
            dataType="الملفات"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>قائمة الملفات ({filteredFiles.length})</SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredFiles}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد ملفات"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* File Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل الملف"
        size="lg"
      >
        {selectedFile && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>اسم الملف:</strong>
                <p>{selectedFile.name}</p>
              </div>
              <div>
                <strong>نوع الملف:</strong>
                <p>{getFileTypeLabel(selectedFile.type)}</p>
              </div>
              <div>
                <strong>حجم الملف:</strong>
                <p>{formatFileSize(selectedFile.size)}</p>
              </div>
              <div>
                <strong>الحالة:</strong>
                <p><StatusBadge status={selectedFile.status}>{selectedFile.status === 'active' ? 'نشط' : 'مؤرشف'}</StatusBadge></p>
              </div>
              <div>
                <strong>رفع بواسطة:</strong>
                <p>{selectedFile.uploadedBy}</p>
              </div>
              <div>
                <strong>تاريخ الرفع:</strong>
                <p>{formatDate(selectedFile.uploadedAt)}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>الوصف:</strong>
                <p>{selectedFile.description || 'لا يوجد وصف'}</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #eee'
            }}>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                إغلاق
              </Button>
              <Button variant="primary">
                <i className="fas fa-download"></i>
                تحميل
              </Button>
              <Button variant="warning">
                <i className="fas fa-edit"></i>
                تعديل
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AidFiles;