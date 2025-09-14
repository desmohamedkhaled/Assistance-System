import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import styled from 'styled-components';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
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

const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  padding: 40px;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  text-align: right;
`;

const Input = styled.input`
  padding: 12px 16px;
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

const Select = styled.select`
  padding: 12px 16px;
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

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;
  direction: rtl;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Required = styled.span`
  color: #dc3545;
  margin-right: 4px;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
`;

const InfoIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
`;

const InfoTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
`;

const RequestAssistance: React.FC = () => {
  const { data } = useApp();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    beneficiaryId: '',
    assistanceType: '',
    amount: '',
    paymentMethod: '',
    notes: '',
    priority: 'عادي'
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.beneficiaryId || !formData.assistanceType || !formData.amount || !formData.paymentMethod) {
        toast.error('يرجى ملء جميع الحقول المطلوبة');
        setIsSubmitting(false);
        return;
      }

      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('يرجى إدخال مبلغ صحيح');
        setIsSubmitting(false);
        return;
      }

      if (amount > 1000000) {
        toast.error('المبلغ المطلوب كبير جداً');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccessModal(true);
      toast.success('تم إرسال طلب المساعدة بنجاح');
      
      // Reset form
      setFormData({
        beneficiaryId: '',
        assistanceType: '',
        amount: '',
        paymentMethod: '',
        notes: '',
        priority: 'عادي'
      });
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const assistanceTypes = [
    'طبية', 'أيتام', 'أرامل', 'ذوي الاحتياجات', 
    'تعليمية', 'أسر السجناء', 'مالية'
  ];

  const paymentMethods = [
    'نقدي', 'تحويل بنكي', 'شيك', 'بطاقة ائتمان'
  ];

  const priorities = [
    { value: 'عاجل', label: 'عاجل' },
    { value: 'عادي', label: 'عادي' },
    { value: 'منخفض', label: 'منخفض' }
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>طلب مساعدة</PageTitle>
        <PageSubtitle>
          {user?.role === 'beneficiary' 
            ? `مرحباً ${user.fullName}، يمكنك تقديم طلب مساعدة جديدة`
            : 'تقديم طلب مساعدة جديدة للمستفيدين'
          }
        </PageSubtitle>
      </PageHeader>

      <InfoCard>
        <InfoIcon>
          <i className="fas fa-hand-holding-heart"></i>
        </InfoIcon>
        <InfoTitle>طلب مساعدة جديدة</InfoTitle>
        <InfoText>
          يرجى ملء جميع الحقول المطلوبة بدقة لضمان معالجة طلبك في أسرع وقت ممكن
        </InfoText>
      </InfoCard>

      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>
                <Required>*</Required>
                المستفيد
              </Label>
              <Select
                name="beneficiaryId"
                value={formData.beneficiaryId}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر المستفيد</option>
                {data.beneficiaries.map(beneficiary => (
                  <option key={beneficiary.id} value={beneficiary.id}>
                    {beneficiary.firstName} {beneficiary.lastName} - {beneficiary.nationalId}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Required>*</Required>
                نوع المساعدة
              </Label>
              <Select
                name="assistanceType"
                value={formData.assistanceType}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر نوع المساعدة</option>
                {assistanceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Required>*</Required>
                المبلغ المطلوب (جنيه مصري)
              </Label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="أدخل المبلغ المطلوب"
                min="0"
                step="0.01"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Required>*</Required>
                طريقة الدفع
              </Label>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر طريقة الدفع</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>أولوية الطلب</Label>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>ملاحظات إضافية</Label>
              <TextArea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="أضف أي ملاحظات أو تفاصيل إضافية حول طلب المساعدة..."
              />
            </FormGroup>
          </FormGrid>

          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData({
                  beneficiaryId: '',
                  assistanceType: '',
                  amount: '',
                  paymentMethod: '',
                  notes: '',
                  priority: 'عادي'
                });
              }}
            >
              <i className="fas fa-undo"></i>
              إعادة تعيين
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <i className="fas fa-paper-plane"></i>
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
          </FormActions>
        </form>
      </FormContainer>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="تم إرسال الطلب بنجاح"
        size="md"
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', color: '#28a745', marginBottom: '20px' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>
            تم إرسال طلب المساعدة بنجاح
          </h3>
          <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>
            تم استلام طلبك وسيتم مراجعته من قبل الفريق المختص. 
            سيتم إشعارك بالنتيجة في أقرب وقت ممكن.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={() => setShowSuccessModal(false)}
            >
              <i className="fas fa-check"></i>
              موافق
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default RequestAssistance;