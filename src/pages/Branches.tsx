import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { Branch, TableColumn } from '@/types';
import { formatDate } from '@/utils/format';
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

const Branches: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter branches based on search term and filters
  const filteredBranches = useMemo(() => {
    let filtered = data.branches;

    if (searchTerm) {
      filtered = filtered.filter(branch => 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.phone.includes(searchTerm)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(branch => branch.status === statusFilter);
    }

    return filtered;
  }, [data.branches, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.branches.length;
    const active = data.branches.filter(b => b.status === 'active').length;
    const inactive = data.branches.filter(b => b.status === 'inactive').length;
    const totalManagers = data.users.filter(u => u.role === 'branch_manager').length;
    const totalStaff = data.users.filter(u => u.role === 'staff').length;

    return {
      total,
      active,
      inactive,
      totalManagers,
      totalStaff
    };
  }, [data.branches, data.users]);

  const handleExport = (format: 'pdf' | 'excel', options?: any) => {
    toast('تصدير بيانات الفروع قيد التطوير', { icon: 'ℹ️' });
  };

  const handleRowClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowDetailsModal(true);
  };

  const getManagerName = (managerId: number) => {
    const manager = data.users.find(u => u.id === managerId);
    return manager ? manager.fullName : 'غير محدد';
  };

  const getBranchStaffCount = (branchId: number) => {
    return data.users.filter(u => u.branchId === branchId && u.role === 'staff').length;
  };

  const columns: TableColumn<Branch>[] = [
    {
      key: 'name',
      label: 'اسم الفرع'
    },
    {
      key: 'address',
      label: 'العنوان'
    },
    {
      key: 'phone',
      label: 'الهاتف'
    },
    {
      key: 'managerId',
      label: 'مدير الفرع',
      render: (value) => getManagerName(value)
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <StatusBadge status={value}>{value === 'active' ? 'نشط' : 'غير نشط'}</StatusBadge>
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإنشاء',
      render: (value) => formatDate(value)
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>الفروع</PageTitle>
        <PageSubtitle>إدارة فروع المؤسسة والموظفين</PageSubtitle>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon $color="#667eea">
            <i className="fas fa-building"></i>
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>إجمالي الفروع</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#28a745">
            <i className="fas fa-check-circle"></i>
          </StatIcon>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>الفروع النشطة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#dc3545">
            <i className="fas fa-times-circle"></i>
          </StatIcon>
          <StatValue>{stats.inactive}</StatValue>
          <StatLabel>الفروع غير النشطة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#6f42c1">
            <i className="fas fa-user-tie"></i>
          </StatIcon>
          <StatValue>{stats.totalManagers}</StatValue>
          <StatLabel>مديري الفروع</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-users"></i>
          </StatIcon>
          <StatValue>{stats.totalStaff}</StatValue>
          <StatLabel>موظفي الفروع</StatLabel>
        </StatCard>
      </StatsContainer>

      <PageActions>
        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="البحث باسم الفرع أو العنوان أو الهاتف..."
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
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </FilterSelect>
        </FiltersContainer>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary">
            <i className="fas fa-plus"></i>
            إضافة فرع
          </Button>
          <ExportButton 
            onExport={handleExport} 
            dataType="الفروع"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>قائمة الفروع ({filteredBranches.length})</SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredBranches}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد فروع"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* Branch Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل الفرع"
        size="lg"
      >
        {selectedBranch && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>اسم الفرع:</strong>
                <p>{selectedBranch.name}</p>
              </div>
              <div>
                <strong>العنوان:</strong>
                <p>{selectedBranch.address}</p>
              </div>
              <div>
                <strong>الهاتف:</strong>
                <p>{selectedBranch.phone}</p>
              </div>
              <div>
                <strong>مدير الفرع:</strong>
                <p>{getManagerName(selectedBranch.managerId)}</p>
              </div>
              <div>
                <strong>الحالة:</strong>
                <p><StatusBadge status={selectedBranch.status}>{selectedBranch.status === 'active' ? 'نشط' : 'غير نشط'}</StatusBadge></p>
              </div>
              <div>
                <strong>عدد الموظفين:</strong>
                <p>{getBranchStaffCount(selectedBranch.id)} موظف</p>
              </div>
              <div>
                <strong>تاريخ الإنشاء:</strong>
                <p>{formatDate(selectedBranch.createdAt)}</p>
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
              <Button variant="warning">
                <i className="fas fa-users"></i>
                إدارة الموظفين
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Branches;
