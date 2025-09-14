import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { Assistance, TableColumn } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { exportAdminRequestsToExcel } from '@/utils/export';
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const AdminRequests: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Assistance | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'pay'>('approve');

  // Filter requests based on search term and filters
  const filteredRequests = useMemo(() => {
    let filtered = data.assistances;

    if (searchTerm) {
      filtered = filtered.filter(request => {
        const beneficiary = data.beneficiaries.find(b => b.id === request.beneficiaryId);
        const beneficiaryName = beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : '';
        return (
          request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(request => request.type === typeFilter);
    }

    return filtered;
  }, [data.assistances, data.beneficiaries, searchTerm, statusFilter, typeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = data.assistances.length;
    const pending = data.assistances.filter(r => r.status === 'معلق').length;
    const underReview = data.assistances.filter(r => r.status === 'قيد المراجعة').length;
    const approved = data.assistances.filter(r => r.status === 'معتمد').length;
    const paid = data.assistances.filter(r => r.status === 'مدفوع').length;
    const rejected = data.assistances.filter(r => r.status === 'مرفوض').length;
    const totalAmount = data.assistances.reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = data.assistances
      .filter(r => r.status === 'معلق' || r.status === 'قيد المراجعة')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      total,
      pending,
      underReview,
      approved,
      paid,
      rejected,
      totalAmount,
      pendingAmount
    };
  }, [data.assistances]);

  const handleExport = (format: 'pdf' | 'excel', options?: Record<string, unknown>) => {
    const success = exportAdminRequestsToExcel(filteredData);
    if (success) {
      toast.success('تم تصدير البيانات بنجاح');
    } else {
      toast.error('حدث خطأ أثناء تصدير البيانات');
    }
  };

  const handleRowClick = (request: Assistance) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleAction = (type: 'approve' | 'reject' | 'pay') => {
    setActionType(type);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (selectedRequest) {
      let message = '';
      switch (actionType) {
        case 'approve':
          message = 'تم اعتماد الطلب بنجاح';
          break;
        case 'reject':
          message = 'تم رفض الطلب';
          break;
        case 'pay':
          message = 'تم تسجيل الدفع بنجاح';
          break;
      }
      toast.success(message);
      setShowActionModal(false);
      setShowDetailsModal(false);
    }
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
      label: 'تاريخ الطلب',
      render: (value) => formatDate(value)
    },
    {
      key: 'id',
      label: 'الإجراءات',
      render: (value, item) => (
        <ActionButtons>
          {item.status === 'معلق' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRequest(item);
                  handleAction('approve');
                }}
              >
                <i className="fas fa-check"></i>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRequest(item);
                  handleAction('reject');
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            </>
          )}
          {item.status === 'معتمد' && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRequest(item);
                handleAction('pay');
              }}
            >
              <i className="fas fa-money-bill"></i>
            </Button>
          )}
        </ActionButtons>
      )
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>إدارة الطلبات</PageTitle>
        <PageSubtitle>مراجعة وإدارة طلبات المساعدة</PageSubtitle>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon $color="#667eea">
            <i className="fas fa-file-alt"></i>
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>إجمالي الطلبات</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#ffc107">
            <i className="fas fa-clock"></i>
          </StatIcon>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>طلبات معلقة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#17a2b8">
            <i className="fas fa-eye"></i>
          </StatIcon>
          <StatValue>{stats.underReview}</StatValue>
          <StatLabel>قيد المراجعة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#28a745">
            <i className="fas fa-check-circle"></i>
          </StatIcon>
          <StatValue>{stats.approved}</StatValue>
          <StatLabel>طلبات معتمدة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#6f42c1">
            <i className="fas fa-money-bill-wave"></i>
          </StatIcon>
          <StatValue>{stats.paid}</StatValue>
          <StatLabel>طلبات مدفوعة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#dc3545">
            <i className="fas fa-times-circle"></i>
          </StatIcon>
          <StatValue>{stats.rejected}</StatValue>
          <StatLabel>طلبات مرفوضة</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#20c997">
            <i className="fas fa-coins"></i>
          </StatIcon>
          <StatValue>{formatCurrency(stats.totalAmount)}</StatValue>
          <StatLabel>إجمالي المبلغ</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="#fd7e14">
            <i className="fas fa-hourglass-half"></i>
          </StatIcon>
          <StatValue>{formatCurrency(stats.pendingAmount)}</StatValue>
          <StatLabel>مبلغ معلق</StatLabel>
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <ExportButton 
            onExport={handleExport} 
            dataType="طلبات الإدارة"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>قائمة الطلبات ({filteredRequests.length})</SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredRequests}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد طلبات"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* Request Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل الطلب"
        size="lg"
      >
        {selectedRequest && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>نوع المساعدة:</strong>
                <p>{selectedRequest.type}</p>
              </div>
              <div>
                <strong>المبلغ:</strong>
                <p>{formatCurrency(selectedRequest.amount)}</p>
              </div>
              <div>
                <strong>المستفيد:</strong>
                <p>
                  {(() => {
                    const beneficiary = data.beneficiaries.find(b => b.id === selectedRequest.beneficiaryId);
                    return beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : 'غير محدد';
                  })()}
                </p>
              </div>
              <div>
                <strong>طريقة الدفع:</strong>
                <p>{selectedRequest.paymentMethod}</p>
              </div>
              <div>
                <strong>الحالة:</strong>
                <p><StatusBadge status={selectedRequest.status}>{selectedRequest.status}</StatusBadge></p>
              </div>
              <div>
                <strong>تاريخ الطلب:</strong>
                <p>{formatDate(selectedRequest.date)}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>الملاحظات:</strong>
                <p>{selectedRequest.notes || 'لا توجد ملاحظات'}</p>
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
              {selectedRequest.status === 'معلق' && (
                <>
                  <Button variant="success" onClick={() => handleAction('approve')}>
                    <i className="fas fa-check"></i>
                    اعتماد
                  </Button>
                  <Button variant="danger" onClick={() => handleAction('reject')}>
                    <i className="fas fa-times"></i>
                    رفض
                  </Button>
                </>
              )}
              {selectedRequest.status === 'معتمد' && (
                <Button variant="primary" onClick={() => handleAction('pay')}>
                  <i className="fas fa-money-bill"></i>
                  تسجيل الدفع
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={actionType === 'approve' ? 'اعتماد الطلب' : actionType === 'reject' ? 'رفض الطلب' : 'تسجيل الدفع'}
        size="md"
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: actionType === 'approve' ? '#28a745' : actionType === 'reject' ? '#dc3545' : '#007bff', marginBottom: '20px' }}>
            <i className={`fas ${actionType === 'approve' ? 'fa-check-circle' : actionType === 'reject' ? 'fa-times-circle' : 'fa-money-bill-wave'}`}></i>
          </div>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>
            {actionType === 'approve' ? 'هل تريد اعتماد هذا الطلب؟' : 
             actionType === 'reject' ? 'هل تريد رفض هذا الطلب؟' : 
             'هل تريد تسجيل الدفع لهذا الطلب؟'}
          </h3>
          <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>
            {actionType === 'approve' ? 'سيتم اعتماد الطلب ويمكن للمستفيد الحصول على المساعدة' :
             actionType === 'reject' ? 'سيتم رفض الطلب ولن يتم تقديم المساعدة' :
             'سيتم تسجيل الدفع وتحديث حالة الطلب إلى مدفوع'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setShowActionModal(false)}>
              إلغاء
            </Button>
            <Button
              variant={actionType === 'approve' ? 'success' : actionType === 'reject' ? 'danger' : 'primary'}
              onClick={confirmAction}
            >
              <i className={`fas ${actionType === 'approve' ? 'fa-check' : actionType === 'reject' ? 'fa-times' : 'fa-money-bill'}`}></i>
              {actionType === 'approve' ? 'اعتماد' : actionType === 'reject' ? 'رفض' : 'تسجيل الدفع'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default AdminRequests;