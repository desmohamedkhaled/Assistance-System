import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { Assistance, TableColumn } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { exportAssistancesToExcel, exportAssistancesToPDF } from '@/utils/export';
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
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(40, 167, 69, 0.1);
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  direction: rtl;

  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.1);
    background: white;
    transform: translateY(-1px);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 50px 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  direction: rtl;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.1);
    background: white;
    transform: translateY(-1px);
  }
`;

const SearchIcon = styled.i`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #28a745;
  font-size: 16px;
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid rgba(40, 167, 69, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
  }
`;

const SectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f1f3f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
  text-align: right;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(40, 167, 69, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  font-size: 36px;
  color: ${props => props.$color};
  margin-bottom: 12px;
  transition: transform 0.3s ease;

  ${StatCard}:hover & {
    transform: scale(1.1);
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const Assistances: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedAssistance, setSelectedAssistance] = useState<Assistance | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter assistances based on search term and filters
  const filteredAssistances = useMemo(() => {
    let filtered = data.assistances;

    if (searchTerm) {
      filtered = filtered.filter(assistance => {
        const beneficiary = data.beneficiaries.find(b => b.id === assistance.beneficiaryId);
        const beneficiaryName = beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : '';
        return (
          assistance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assistance.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(assistance => assistance.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(assistance => assistance.type === typeFilter);
    }

    return filtered;
  }, [data.assistances, data.beneficiaries, searchTerm, statusFilter, typeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.assistances.length;
    const paid = data.assistances.filter(a => a.status === 'مدفوع').length;
    const pending = data.assistances.filter(a => a.status === 'معلق').length;
    const approved = data.assistances.filter(a => a.status === 'معتمد').length;
    const totalAmount = data.assistances.reduce((sum, a) => sum + a.amount, 0);
    const paidAmount = data.assistances
      .filter(a => a.status === 'مدفوع')
      .reduce((sum, a) => sum + a.amount, 0);

    return {
      total,
      paid,
      pending,
      approved,
      totalAmount,
      paidAmount
    };
  }, [data.assistances]);

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      const success = exportAssistancesToPDF(data.assistances, data.beneficiaries);
      if (success) {
        toast.success('تم تصدير بيانات المساعدات بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير البيانات');
      }
    } else if (format === 'excel') {
      const success = exportAssistancesToExcel(data.assistances, data.beneficiaries);
      if (success) {
        toast.success('تم تصدير بيانات المساعدات بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير البيانات');
      }
    }
  };

  const handleRowClick = (assistance: Assistance) => {
    setSelectedAssistance(assistance);
    setShowDetailsModal(true);
  };

  const columns: TableColumn<Assistance>[] = [
    {
      key: 'type',
      label: 'نوع المساعدة'
    },
    {
      key: 'amount',
      label: 'المبلغ',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'beneficiaryId',
      label: 'المستفيد',
      render: (value) => {
        const beneficiary = data.beneficiaries.find(b => b.id === value);
        return beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : 'غير محدد';
      }
    },
    {
      key: 'paymentMethod',
      label: 'طريقة الدفع'
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'date',
      label: 'التاريخ',
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
              <i className="fas fa-hand-holding-heart ml-3"></i>
              المساعدات
            </PageTitle>
            <PageSubtitle>إدارة المساعدات المالية والعينية</PageSubtitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">إجمالي المساعدات</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-16 h-16 bg-white/20  rounded-full flex items-center justify-center">
              <i className="fas fa-heart text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon $color="#667eea">
            <i className="fas fa-hand-holding-heart"></i>
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>إجمالي المساعدات</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#28a745">
            <i className="fas fa-check-circle"></i>
          </StatIcon>
          <StatValue>{stats.paid}</StatValue>
          <StatLabel>المساعدات المدفوعة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#ffc107">
            <i className="fas fa-clock"></i>
          </StatIcon>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>المساعدات المعلقة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-thumbs-up"></i>
          </StatIcon>
          <StatValue>{stats.approved}</StatValue>
          <StatLabel>المساعدات المعتمدة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#6f42c1">
            <i className="fas fa-money-bill-wave"></i>
          </StatIcon>
          <StatValue>{formatCurrency(stats.totalAmount)}</StatValue>
          <StatLabel>إجمالي المبلغ</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#20c997">
            <i className="fas fa-coins"></i>
          </StatIcon>
          <StatValue>{formatCurrency(stats.paidAmount)}</StatValue>
          <StatLabel>المبلغ المدفوع</StatLabel>
        </StatCard>
      </StatsContainer>

      <PageActions>
        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="البحث بنوع المساعدة أو المستفيد..."
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
            <option value="معلق">معلق</option>
            <option value="قيد المراجعة">قيد المراجعة</option>
            <option value="معتمد">معتمد</option>
            <option value="مدفوع">مدفوع</option>
            <option value="مرفوض">مرفوض</option>
          </FilterSelect>
          <FilterSelect
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            <option value="طبية">طبية</option>
            <option value="أيتام">أيتام</option>
            <option value="أرامل">أرامل</option>
            <option value="ذوي الاحتياجات">ذوي الاحتياجات</option>
            <option value="تعليمية">تعليمية</option>
            <option value="أسر السجناء">أسر السجناء</option>
            <option value="مالية">مالية</option>
          </FilterSelect>
        </FiltersContainer>
        <div className="flex gap-3">
          <Button variant="primary">
            <i className="fas fa-plus"></i>
            إضافة مساعدة
          </Button>
          <ExportButton 
            onExport={handleExport} 
            dataType="المساعدات"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>
            <i className="fas fa-list text-success-500"></i>
            قائمة المساعدات ({filteredAssistances.length})
          </SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredAssistances}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد بيانات مساعدات"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* Assistance Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل المساعدة"
        size="lg"
      >
        {selectedAssistance && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>نوع المساعدة:</strong>
                <p>{selectedAssistance.type}</p>
              </div>
              <div>
                <strong>المبلغ:</strong>
                <p>{formatCurrency(selectedAssistance.amount)}</p>
              </div>
              <div>
                <strong>المستفيد:</strong>
                <p>
                  {(() => {
                    const beneficiary = data.beneficiaries.find(b => b.id === selectedAssistance.beneficiaryId);
                    return beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : 'غير محدد';
                  })()}
                </p>
              </div>
              <div>
                <strong>طريقة الدفع:</strong>
                <p>{selectedAssistance.paymentMethod}</p>
              </div>
              <div>
                <strong>الحالة:</strong>
                <p><StatusBadge status={selectedAssistance.status}>{selectedAssistance.status}</StatusBadge></p>
              </div>
              <div>
                <strong>التاريخ:</strong>
                <p>{formatDate(selectedAssistance.date)}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>الملاحظات:</strong>
                <p>{selectedAssistance.notes || 'لا توجد ملاحظات'}</p>
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

export default Assistances;