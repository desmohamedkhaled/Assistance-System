import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { Project, TableColumn } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { exportProjectsToExcel } from '@/utils/export';
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
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    animation: float 20s ease-in-out infinite;
  }
`;

const PageTitle = styled.h1`
  font-size: 36px;
  color: white;
  margin-bottom: 8px;
  line-height: 1.3;
  font-weight: 700;
  text-align: right;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  line-height: 1.6;
  margin: 0;
  text-align: right;
  position: relative;
  z-index: 1;
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

const Projects: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter projects based on search term and filters
  const filteredProjects = useMemo(() => {
    let filtered = data.projects;

    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(project => project.type === typeFilter);
    }

    return filtered;
  }, [data.projects, searchTerm, statusFilter, typeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.projects.length;
    const active = data.projects.filter(p => p.status === 'نشط').length;
    const completed = data.projects.filter(p => p.status === 'مكتمل').length;
    const totalBudget = data.projects.reduce((sum, p) => sum + p.budget, 0);

    return {
      total,
      active,
      completed,
      totalBudget
    };
  }, [data.projects]);

  const handleExport = (format: 'pdf' | 'excel', options?: Record<string, unknown>) => {
    if (format === 'excel') {
      const success = exportProjectsToExcel(data.projects, data.organizations);
      if (success) {
        toast.success('تم تصدير بيانات المشاريع بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير البيانات');
      }
    } else {
      const success = exportProjectsToExcel(filteredData);
      if (success) {
        toast.success('تم تصدير البيانات بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير البيانات');
      }
    }
  };

  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const columns: TableColumn<Project>[] = [
    {
      key: 'name',
      label: 'اسم المشروع'
    },
    {
      key: 'type',
      label: 'نوع المشروع'
    },
    {
      key: 'organizationId',
      label: 'المؤسسة',
      render: (value) => {
        const organization = data.organizations.find(org => org.id === value);
        return organization ? organization.name : 'غير محدد';
      }
    },
    {
      key: 'budget',
      label: 'الميزانية',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'startDate',
      label: 'تاريخ البداية',
      render: (value) => formatDate(value)
    },
    {
      key: 'endDate',
      label: 'تاريخ النهاية',
      render: (value) => formatDate(value)
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex items-center justify-between">
          <div>
            <PageTitle>
              <i className="fas fa-project-diagram ml-3"></i>
              المشاريع
            </PageTitle>
            <PageSubtitle>إدارة المشاريع والبرامج التنموية</PageSubtitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">إجمالي المشاريع</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-16 h-16 bg-white/20  rounded-full flex items-center justify-center">
              <i className="fas fa-tasks text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon $color="#667eea">
            <i className="fas fa-project-diagram"></i>
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>إجمالي المشاريع</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#28a745">
            <i className="fas fa-play-circle"></i>
          </StatIcon>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>المشاريع النشطة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-check-circle"></i>
          </StatIcon>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>المشاريع المكتملة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#6f42c1">
            <i className="fas fa-money-bill-wave"></i>
          </StatIcon>
          <StatValue>{formatCurrency(stats.totalBudget)}</StatValue>
          <StatLabel>إجمالي الميزانية</StatLabel>
        </StatCard>
      </StatsContainer>

      <PageActions>
        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="البحث باسم المشروع أو الوصف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="fas fa-search"></SearchIcon>
          </SearchContainer>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            <option value="نشط">نشط</option>
            <option value="معلق">معلق</option>
            <option value="مكتمل">مكتمل</option>
            <option value="ملغي">ملغي</option>
          </FilterSelect>
          <FilterSelect
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            <option value="تنموي">تنموي</option>
            <option value="خيري">خيري</option>
            <option value="تعليمي">تعليمي</option>
            <option value="صحي">صحي</option>
            <option value="اجتماعي">اجتماعي</option>
          </FilterSelect>
        </FiltersContainer>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary">
            <i className="fas fa-plus"></i>
            إضافة مشروع
          </Button>
          <ExportButton 
            onExport={handleExport} 
            dataType="المشاريع"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>قائمة المشاريع ({filteredProjects.length})</SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredProjects}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد بيانات مشاريع"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* Project Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل المشروع"
        size="lg"
      >
        {selectedProject && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>اسم المشروع:</strong>
                <p>{selectedProject.name}</p>
              </div>
              <div>
                <strong>نوع المشروع:</strong>
                <p>{selectedProject.type}</p>
              </div>
              <div>
                <strong>المؤسسة:</strong>
                <p>
                  {(() => {
                    const organization = data.organizations.find(org => org.id === selectedProject.organizationId);
                    return organization ? organization.name : 'غير محدد';
                  })()}
                </p>
              </div>
              <div>
                <strong>الميزانية:</strong>
                <p>{formatCurrency(selectedProject.budget)}</p>
              </div>
              <div>
                <strong>الحالة:</strong>
                <p><StatusBadge status={selectedProject.status}>{selectedProject.status}</StatusBadge></p>
              </div>
              <div>
                <strong>تاريخ البداية:</strong>
                <p>{formatDate(selectedProject.startDate)}</p>
              </div>
              <div>
                <strong>تاريخ النهاية:</strong>
                <p>{formatDate(selectedProject.endDate)}</p>
              </div>
              <div>
                <strong>تاريخ التسجيل:</strong>
                <p>{formatDate(selectedProject.createdAt)}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>الوصف:</strong>
                <p>{selectedProject.description || 'لا يوجد وصف'}</p>
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

export default Projects;