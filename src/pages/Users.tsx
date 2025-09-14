import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { User, TableColumn } from '@/types';
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

const RoleBadge = styled.span<{ $role: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.$role) {
      case 'admin': return '#dc3545';
      case 'user': return '#28a745';
      case 'bank_employee': return '#007bff';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const Users: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    let filtered = data.users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    return filtered;
  }, [data.users, searchTerm, roleFilter, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.users.length;
    const admins = data.users.filter(u => u.role === 'admin').length;
    const branchManagers = data.users.filter(u => u.role === 'branch_manager').length;
    const staff = data.users.filter(u => u.role === 'staff').length;
    const approvers = data.users.filter(u => u.role === 'approver').length;
    const beneficiaries = data.users.filter(u => u.role === 'beneficiary').length;
    const active = data.users.filter(u => u.status === 'active').length;

    return {
      total,
      admins,
      branchManagers,
      staff,
      approvers,
      beneficiaries,
      active
    };
  }, [data.users]);

  const handleExport = (format: 'pdf' | 'excel', options?: any) => {
    toast('تصدير بيانات المستخدمين قيد التطوير', { icon: 'ℹ️' });
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير النظام';
      case 'branch_manager': return 'مدير فرع';
      case 'staff': return 'موظف إدخال بيانات';
      case 'approver': return 'لجنة الموافقات';
      case 'beneficiary': return 'مستفيد';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'معلق';
      default: return status;
    }
  };

  const getBranchName = (branchId?: number) => {
    if (!branchId) return 'غير محدد';
    const branch = data.branches.find(b => b.id === branchId);
    return branch ? branch.name : 'غير محدد';
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'username',
      label: 'اسم المستخدم'
    },
    {
      key: 'fullName',
      label: 'الاسم الكامل'
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني'
    },
    {
      key: 'role',
      label: 'الدور',
      render: (value) => (
        <RoleBadge $role={value}>
          {getRoleLabel(value)}
        </RoleBadge>
      )
    },
    {
      key: 'branchId',
      label: 'الفرع',
      render: (value, item) => getBranchName(item.branchId)
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <StatusBadge status={value}>{getStatusLabel(value)}</StatusBadge>
    },
    {
      key: 'lastLogin',
      label: 'آخر تسجيل دخول',
      render: (value) => value ? formatDate(value) : 'لم يسجل دخول'
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
        <PageTitle>المستخدمين</PageTitle>
        <PageSubtitle>إدارة المستخدمين والصلاحيات</PageSubtitle>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon $color="#667eea">
            <i className="fas fa-users"></i>
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>إجمالي المستخدمين</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#dc3545">
            <i className="fas fa-user-shield"></i>
          </StatIcon>
          <StatValue>{stats.admins}</StatValue>
          <StatLabel>المديرين</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#28a745">
            <i className="fas fa-user-tie"></i>
          </StatIcon>
          <StatValue>{stats.branchManagers}</StatValue>
          <StatLabel>مديري الفروع</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#007bff">
            <i className="fas fa-user-edit"></i>
          </StatIcon>
          <StatValue>{stats.staff}</StatValue>
          <StatLabel>موظفي الإدخال</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#6f42c1">
            <i className="fas fa-gavel"></i>
          </StatIcon>
          <StatValue>{stats.approvers}</StatValue>
          <StatLabel>لجنة الموافقات</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-users"></i>
          </StatIcon>
          <StatValue>{stats.beneficiaries}</StatValue>
          <StatLabel>المستفيدين</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-check-circle"></i>
          </StatIcon>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>المستخدمين النشطين</StatLabel>
        </StatCard>
      </StatsContainer>

      <PageActions>
        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="البحث باسم المستخدم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="fas fa-search"></SearchIcon>
          </SearchContainer>
          <FilterSelect
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">جميع الأدوار</option>
            <option value="admin">مدير النظام</option>
            <option value="branch_manager">مدير فرع</option>
            <option value="staff">موظف إدخال بيانات</option>
            <option value="approver">لجنة الموافقات</option>
            <option value="beneficiary">مستفيد</option>
          </FilterSelect>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="suspended">معلق</option>
          </FilterSelect>
        </FiltersContainer>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary">
            <i className="fas fa-plus"></i>
            إضافة مستخدم
          </Button>
          <ExportButton 
            onExport={handleExport} 
            dataType="المستخدمين"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>قائمة المستخدمين ({filteredUsers.length})</SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد بيانات مستخدمين"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل المستخدم"
        size="lg"
      >
        {selectedUser && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>اسم المستخدم:</strong>
                <p>{selectedUser.username}</p>
              </div>
              <div>
                <strong>الاسم الكامل:</strong>
                <p>{selectedUser.fullName}</p>
              </div>
              <div>
                <strong>البريد الإلكتروني:</strong>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <strong>الدور:</strong>
                <p>
                  <RoleBadge $role={selectedUser.role}>
                    {getRoleLabel(selectedUser.role)}
                  </RoleBadge>
                </p>
              </div>
              <div>
                <strong>الفرع:</strong>
                <p>{getBranchName(selectedUser.branchId)}</p>
              </div>
              <div>
                <strong>الحالة:</strong>
                <p><StatusBadge status={selectedUser.status}>{getStatusLabel(selectedUser.status)}</StatusBadge></p>
              </div>
              <div>
                <strong>آخر تسجيل دخول:</strong>
                <p>{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'لم يسجل دخول'}</p>
              </div>
              <div>
                <strong>تاريخ الإنشاء:</strong>
                <p>{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <strong>آخر تحديث:</strong>
                <p>{selectedUser.updatedAt ? formatDate(selectedUser.updatedAt) : 'لم يتم التحديث'}</p>
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
              <Button variant="danger">
                <i className="fas fa-lock"></i>
                تعطيل
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Users;