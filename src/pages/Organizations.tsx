import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { Organization, TableColumn } from '@/types';
import { formatDate } from '@/utils/format';
import { exportOrganizationsToExcel } from '@/utils/export';
import DataTable from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
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

const Organizations: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter organizations based on search term
  const filteredOrganizations = useMemo(() => {
    if (!searchTerm) return data.organizations;
    
    return data.organizations.filter(organization => 
      organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organization.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organization.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organization.phone.includes(searchTerm)
    );
  }, [data.organizations, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.organizations.length;
    const active = data.organizations.filter(org => org.status === 'نشط').length;
    const inactive = data.organizations.filter(org => org.status === 'غير نشط').length;
    const totalProjects = data.projects.length;

    return {
      total,
      active,
      inactive,
      totalProjects
    };
  }, [data.organizations, data.projects]);

  const handleExport = (format: 'pdf' | 'excel', options?: any) => {
    if (format === 'excel') {
      const success = exportOrganizationsToExcel(data.organizations);
      if (success) {
        toast.success('تم تصدير بيانات المؤسسات بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير البيانات');
      }
    } else {
      toast('تصدير PDF قيد التطوير', { icon: 'ℹ️' });
    }
  };

  const handleRowClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setShowDetailsModal(true);
  };

  const columns: TableColumn<Organization>[] = [
    {
      key: 'name',
      label: 'اسم المؤسسة'
    },
    {
      key: 'type',
      label: 'نوع المؤسسة'
    },
    {
      key: 'contactPerson',
      label: 'الشخص المسؤول'
    },
    {
      key: 'phone',
      label: 'الهاتف'
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني'
    },
    {
      key: 'status',
      label: 'الحالة'
    },
    {
      key: 'createdAt',
      label: 'تاريخ التسجيل',
      render: (value) => formatDate(value)
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>المؤسسات</PageTitle>
        <PageSubtitle>إدارة المؤسسات الشريكة والمتعاونة</PageSubtitle>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon $color="#667eea">
            <i className="fas fa-building"></i>
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>إجمالي المؤسسات</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#28a745">
            <i className="fas fa-check-circle"></i>
          </StatIcon>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>المؤسسات النشطة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#ffc107">
            <i className="fas fa-pause-circle"></i>
          </StatIcon>
          <StatValue>{stats.inactive}</StatValue>
          <StatLabel>المؤسسات غير النشطة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-project-diagram"></i>
          </StatIcon>
          <StatValue>{stats.totalProjects}</StatValue>
          <StatLabel>إجمالي المشاريع</StatLabel>
        </StatCard>
      </StatsContainer>

      <PageActions>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="البحث باسم المؤسسة أو الشخص المسؤول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="fas fa-search"></SearchIcon>
        </SearchContainer>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary">
            <i className="fas fa-plus"></i>
            إضافة مؤسسة
          </Button>
          <ExportButton 
            onExport={handleExport} 
            dataType="المؤسسات"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>قائمة المؤسسات ({filteredOrganizations.length})</SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredOrganizations}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد بيانات مؤسسات"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* Organization Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل المؤسسة"
        size="lg"
      >
        {selectedOrganization && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>اسم المؤسسة:</strong>
                <p>{selectedOrganization.name}</p>
              </div>
              <div>
                <strong>نوع المؤسسة:</strong>
                <p>{selectedOrganization.type}</p>
              </div>
              <div>
                <strong>العنوان:</strong>
                <p>{selectedOrganization.address}</p>
              </div>
              <div>
                <strong>الهاتف:</strong>
                <p>{selectedOrganization.phone}</p>
              </div>
              <div>
                <strong>رقم الحساب:</strong>
                <p>{selectedOrganization.accountNumber}</p>
              </div>
              <div>
                <strong>الشخص المسؤول:</strong>
                <p>{selectedOrganization.contactPerson}</p>
              </div>
              <div>
                <strong>البريد الإلكتروني:</strong>
                <p>{selectedOrganization.email}</p>
              </div>
              <div>
                <strong>الحالة:</strong>
                <p>{selectedOrganization.status}</p>
              </div>
              <div>
                <strong>تاريخ التسجيل:</strong>
                <p>{formatDate(selectedOrganization.createdAt)}</p>
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

export default Organizations;