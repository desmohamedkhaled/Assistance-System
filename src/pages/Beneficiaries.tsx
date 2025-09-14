import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { Beneficiary, TableColumn } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { exportBeneficiariesToExcel, exportBeneficiariesToPDF } from '@/utils/export';
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

const Beneficiaries: React.FC = () => {
  const { data, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

  const handleExport = (format: 'pdf' | 'excel', options?: any) => {
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

  const columns: TableColumn<Beneficiary>[] = [
    {
      key: 'firstName',
      label: 'الاسم الكامل',
      render: (value, item) => `${item.firstName} ${item.secondName} ${item.thirdName} ${item.lastName}`
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
        <PageTitle>المستفيدين</PageTitle>
        <PageSubtitle>إدارة بيانات المستفيدين من المساعدات</PageSubtitle>
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary">
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
          <SectionTitle>قائمة المستفيدين ({filteredBeneficiaries.length})</SectionTitle>
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

export default Beneficiaries;
