import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import PageTransition from '@/components/UI/PageTransition';

const LoginContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const LogoIcon = styled.i`
  font-size: 40px;
  color: #667eea;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 12px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  direction: rtl;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const InputIcon = styled.i`
  position: absolute;
  right: 12px;
  color: #666;
  z-index: 2;
  font-size: 14px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  left: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  z-index: 2;
  font-size: 14px;
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const ForgotPassword = styled.a`
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LoginFooter = styled.div`
  text-align: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const FooterText = styled.p`
  color: #666;
  font-size: 12px;
  margin: 0;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  margin-left: 20px;
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const InfoIcon = styled.i`
  color: #4ade80;
  font-size: 14px;
`;

const DemoAccounts = styled.div`
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  max-height: 300px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const DemoTitle = styled.h4`
  margin-bottom: 10px;
  font-size: 14px;
`;

const DemoAccount = styled.div`
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 6px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-3px);
  }
`;

const AccountInfo = styled.div`
  flex: 1;
`;

const AccountRole = styled.span`
  font-weight: 600;
  color: #ffd700;
  margin-left: 8px;
`;

const AccountCredentials = styled.span`
  color: #e0e0e0;
  font-size: 10px;
`;

const UseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;


const LoginWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1000px;
  width: 100%;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/dashboard');
      } else {
        toast.error('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleUseAccount = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    toast.success('تم تحميل بيانات الحساب');
  };

  return (
    <PageTransition>
      <LoginContainer>
      <LoginWrapper>
        <LoginCard>
          <LoginHeader>
            <Logo>
              <LogoIcon className="fas fa-hands-helping"></LogoIcon>
              <Title>نظام إدارة المساعدات</Title>
            </Logo>
            <Subtitle>مرحباً بك في نظام إدارة المساعدات</Subtitle>
          </LoginHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">اسم المستخدم</Label>
              <InputGroup>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  required
                />
                <InputIcon className="fas fa-user"></InputIcon>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">كلمة المرور</Label>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <InputIcon className="fas fa-lock"></InputIcon>
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </PasswordToggle>
              </InputGroup>
            </FormGroup>

            <FormOptions>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                تذكرني
              </CheckboxLabel>
              <ForgotPassword href="#">نسيت كلمة المرور؟</ForgotPassword>
            </FormOptions>

            <LoginButton
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="primary" text="" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  تسجيل الدخول
                </>
              )}
            </LoginButton>
          </Form>

          <LoginFooter>
            <FooterText>
              © 2024 نظام إدارة المساعدات. جميع الحقوق محفوظة.
            </FooterText>
          </LoginFooter>
        </LoginCard>

        <InfoCard>
          <InfoTitle>مميزات النظام</InfoTitle>
          <InfoList>
            <InfoItem>
              <InfoIcon className="fas fa-check"></InfoIcon>
              <span>إدارة شاملة للمستفيدين</span>
            </InfoItem>
            <InfoItem>
              <InfoIcon className="fas fa-check"></InfoIcon>
              <span>تتبع المساعدات المقدمة</span>
            </InfoItem>
            <InfoItem>
              <InfoIcon className="fas fa-check"></InfoIcon>
              <span>تقارير مفصلة وإحصائيات</span>
            </InfoItem>
            <InfoItem>
              <InfoIcon className="fas fa-check"></InfoIcon>
              <span>دعم المؤسسات والمشاريع</span>
            </InfoItem>
            <InfoItem>
              <InfoIcon className="fas fa-check"></InfoIcon>
              <span>نظام أمان متقدم</span>
            </InfoItem>
            <InfoItem>
              <InfoIcon className="fas fa-check"></InfoIcon>
              <span>نظام صلاحيات متطور</span>
            </InfoItem>
          </InfoList>
          
          <DemoAccounts>
            <DemoTitle>حسابات تجريبية:</DemoTitle>
            
            <DemoAccount onClick={() => handleUseAccount('admin', 'admin123')}>
              <AccountInfo>
                <AccountRole>مدير عام</AccountRole>
                <AccountCredentials>admin / admin123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('admin', 'admin123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('manager_cairo_mokattam', 'manager123')}>
              <AccountInfo>
                <AccountRole>مدير فرع المقطم</AccountRole>
                <AccountCredentials>manager_cairo_mokattam / manager123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('manager_cairo_mokattam', 'manager123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('manager_cairo_zeitoun', 'manager123')}>
              <AccountInfo>
                <AccountRole>مدير فرع الزيتون</AccountRole>
                <AccountCredentials>manager_cairo_zeitoun / manager123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('manager_cairo_zeitoun', 'manager123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('staff_cairo_1', 'staff123')}>
              <AccountInfo>
                <AccountRole>موظف إدخال بيانات</AccountRole>
                <AccountCredentials>staff_cairo_1 / staff123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('staff_cairo_1', 'staff123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('staff_cairo_2', 'staff123')}>
              <AccountInfo>
                <AccountRole>موظف إدخال بيانات</AccountRole>
                <AccountCredentials>staff_cairo_2 / staff123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('staff_cairo_2', 'staff123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('approver_1', 'approver123')}>
              <AccountInfo>
                <AccountRole>لجنة الموافقات</AccountRole>
                <AccountCredentials>approver_1 / approver123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('approver_1', 'approver123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('approver_2', 'approver123')}>
              <AccountInfo>
                <AccountRole>لجنة الموافقات</AccountRole>
                <AccountCredentials>approver_2 / approver123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('approver_2', 'approver123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('beneficiary_001', 'ben123')}>
              <AccountInfo>
                <AccountRole>مستفيد</AccountRole>
                <AccountCredentials>beneficiary_001 / ben123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('beneficiary_001', 'ben123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('beneficiary_002', 'ben123')}>
              <AccountInfo>
                <AccountRole>مستفيد</AccountRole>
                <AccountCredentials>beneficiary_002 / ben123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('beneficiary_002', 'ben123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('manager_cairo_seventh', 'manager123')}>
              <AccountInfo>
                <AccountRole>مدير فرع السابع</AccountRole>
                <AccountCredentials>manager_cairo_seventh / manager123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('manager_cairo_seventh', 'manager123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('manager_alex_sultan', 'manager123')}>
              <AccountInfo>
                <AccountRole>مدير فرع الإسكندرية</AccountRole>
                <AccountCredentials>manager_alex_sultan / manager123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('manager_alex_sultan', 'manager123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('staff_alex_1', 'staff123')}>
              <AccountInfo>
                <AccountRole>موظف الإسكندرية</AccountRole>
                <AccountCredentials>staff_alex_1 / staff123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('staff_alex_1', 'staff123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('approver_3', 'approver123')}>
              <AccountInfo>
                <AccountRole>لجنة الموافقات</AccountRole>
                <AccountCredentials>approver_3 / approver123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('approver_3', 'approver123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>

            <DemoAccount onClick={() => handleUseAccount('beneficiary_003', 'ben123')}>
              <AccountInfo>
                <AccountRole>مستفيد</AccountRole>
                <AccountCredentials>beneficiary_003 / ben123</AccountCredentials>
              </AccountInfo>
              <UseButton onClick={(e) => { e.stopPropagation(); handleUseAccount('beneficiary_003', 'ben123'); }}>
                استخدام
              </UseButton>
            </DemoAccount>
          </DemoAccounts>
        </InfoCard>
      </LoginWrapper>
      </LoginContainer>
    </PageTransition>
  );
};

export default Login;
