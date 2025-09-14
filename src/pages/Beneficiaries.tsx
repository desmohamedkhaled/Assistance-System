import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { Beneficiary, TableColumn } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { exportBeneficiariesToExcel, exportBeneficiariesToPDF } from '@/utils/export';
import DataTable from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import ExportButton from '@/components/UI/ExportButton';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  border: 1px solid rgba(102, 126, 234, 0.1);
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
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: white;
    transform: translateY(-1px);
  }
`;

const SearchIcon = styled.i`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 16px;
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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

const Beneficiaries: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filter beneficiaries based on search term
  const filteredBeneficiaries = useMemo(() => {
    if (!searchTerm) return data.beneficiaries;
    
    return data.beneficiaries.filter(beneficiary => 
      beneficiary.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.nationalId.includes(searchTerm) ||
      beneficiary.phone.includes(searchTerm)
    );
  }, [data.beneficiaries, searchTerm]);

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      const success = exportBeneficiariesToPDF(data.beneficiaries);
      if (success) {
        toast.success('تم تصدير بيانات المستفيدين بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير البيانات');
      }
    } else if (format === 'excel') {
      const success = exportBeneficiariesToExcel(data.beneficiaries);
      if (success) {
        toast.success('تم تصدير بيانات المستفيدين بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير البيانات');
      }
    }
  };

  const handleRowClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowDetailsModal(true);
  };

  const handleAddBeneficiary = () => {
    setShowAddModal(true);
  };

  const handleEditBeneficiary = () => {
    setShowEditModal(true);
    setShowDetailsModal(false);
  };

  const columns: TableColumn<Beneficiary>[] = [
    {
      key: 'firstName',
      label: 'الاسم الكامل',
      render: (_, item) => `${item.firstName} ${item.secondName} ${item.thirdName} ${item.lastName}`
    },
    {
      key: 'nationalId',
      label: 'رقم الهوية'
    },
    {
      key: 'phone',
      label: 'الهاتف'
    },
    {
      key: 'gender',
      label: 'الجنس'
    },
    {
      key: 'religion',
      label: 'الدين'
    },
    {
      key: 'maritalStatus',
      label: 'الحالة الاجتماعية'
    },
    {
      key: 'familyMembers',
      label: 'عدد أفراد الأسرة'
    },
    {
      key: 'income',
      label: 'الدخل',
      render: (value) => formatCurrency(value)
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
        <div className="flex items-center justify-between">
          <div>
            <PageTitle>
              <i className="fas fa-users ml-3"></i>
              المستفيدين
            </PageTitle>
            <PageSubtitle>إدارة بيانات المستفيدين من المساعدات</PageSubtitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">إجمالي المستفيدين</p>
              <p className="text-2xl font-bold text-white">{data.beneficiaries.length}</p>
            </div>
            <div className="w-16 h-16 bg-white/20  rounded-full flex items-center justify-center">
              <i className="fas fa-user-friends text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </PageHeader>

      <PageActions>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="البحث بالاسم أو رقم الهوية أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="fas fa-search"></SearchIcon>
        </SearchContainer>
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleAddBeneficiary}>
            <i className="fas fa-plus"></i>
            إضافة مستفيد
          </Button>
          <ExportButton 
            onExport={handleExport} 
            dataType="المستفيدين"
          />
        </div>
      </PageActions>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>
            <i className="fas fa-list text-primary-500"></i>
            قائمة المستفيدين ({filteredBeneficiaries.length})
          </SectionTitle>
        </SectionHeader>
        <DataTable
          data={filteredBeneficiaries}
          columns={columns}
          loading={loading}
          emptyMessage="لا توجد بيانات مستفيدين"
          onRowClick={handleRowClick}
        />
      </ContentSection>

      {/* Beneficiary Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل المستفيد"
        size="lg"
      >
        {selectedBeneficiary && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>الاسم الكامل:</strong>
                <p>{selectedBeneficiary.firstName} {selectedBeneficiary.secondName} {selectedBeneficiary.thirdName} {selectedBeneficiary.lastName}</p>
              </div>
              <div>
                <strong>رقم الهوية:</strong>
                <p>{selectedBeneficiary.nationalId}</p>
              </div>
              <div>
                <strong>الهاتف:</strong>
                <p>{selectedBeneficiary.phone}</p>
              </div>
              <div>
                <strong>العنوان:</strong>
                <p>{selectedBeneficiary.address}</p>
              </div>
              <div>
                <strong>الجنس:</strong>
                <p>{selectedBeneficiary.gender}</p>
              </div>
              <div>
                <strong>الدين:</strong>
                <p>{selectedBeneficiary.religion}</p>
              </div>
              <div>
                <strong>الحالة الاجتماعية:</strong>
                <p>{selectedBeneficiary.maritalStatus}</p>
              </div>
              <div>
                <strong>عدد أفراد الأسرة:</strong>
                <p>{selectedBeneficiary.familyMembers}</p>
              </div>
              <div>
                <strong>الدخل:</strong>
                <p>{formatCurrency(selectedBeneficiary.income)}</p>
              </div>
              <div>
                <strong>تاريخ التسجيل:</strong>
                <p>{formatDate(selectedBeneficiary.createdAt)}</p>
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
              <Button variant="primary" onClick={handleEditBeneficiary}>
                <i className="fas fa-edit"></i>
                تعديل
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Beneficiary Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة مستفيد جديد"
        size="lg"
      >
        <div style={{ padding: '20px' }}>
          <p>نموذج إضافة مستفيد جديد - قيد التطوير</p>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary">
              <i className="fas fa-save"></i>
              حفظ
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Beneficiary Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="تعديل بيانات المستفيد"
        size="lg"
      >
        <div style={{ padding: '20px' }}>
          <p>نموذج تعديل بيانات المستفيد - قيد التطوير</p>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary">
              <i className="fas fa-save"></i>
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default Beneficiaries;
