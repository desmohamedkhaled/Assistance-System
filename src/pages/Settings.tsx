import React, { useState } from 'react';
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

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const SettingsCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.12);
  }
`;

const CardHeader = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const CardIcon = styled.div`
  font-size: 32px;
  margin-bottom: 10px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: right;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
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

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #667eea;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const Settings: React.FC = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: 'أحمد محمد علي',
    email: 'ahmed@example.com',
    phone: '01234567890',
    department: 'إدارة المساعدات'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoBackup: true,
    maintenanceMode: false,
    language: 'ar',
    timezone: 'Africa/Cairo'
  });

  const handleProfileUpdate = () => {
    toast.success('تم تحديث الملف الشخصي بنجاح');
    setShowProfileModal(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    toast.success('تم تغيير كلمة المرور بنجاح');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSystemUpdate = () => {
    toast.success('تم حفظ إعدادات النظام بنجاح');
    setShowSystemModal(false);
  };

  const handleBackup = () => {
    toast.success('تم إنشاء نسخة احتياطية بنجاح');
    setShowBackupModal(false);
  };

  const settingsCategories = [
    {
      id: 'profile',
      title: 'الملف الشخصي',
      icon: 'fas fa-user',
      description: 'تحديث معلوماتك الشخصية والتفاصيل',
      action: () => setShowProfileModal(true)
    },
    {
      id: 'security',
      title: 'الأمان',
      icon: 'fas fa-shield-alt',
      description: 'تغيير كلمة المرور وإعدادات الأمان',
      action: () => setShowPasswordModal(true)
    },
    {
      id: 'system',
      title: 'إعدادات النظام',
      icon: 'fas fa-cog',
      description: 'تخصيص إعدادات النظام والتفضيلات',
      action: () => setShowSystemModal(true)
    },
    {
      id: 'backup',
      title: 'النسخ الاحتياطي',
      icon: 'fas fa-database',
      description: 'إنشاء واستعادة النسخ الاحتياطية',
      action: () => setShowBackupModal(true)
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      icon: 'fas fa-bell',
      description: 'إدارة الإشعارات والتنبيهات',
      action: () => toast('إعدادات الإشعارات قيد التطوير', { icon: 'ℹ️' })
    },
    {
      id: 'integrations',
      title: 'التكاملات',
      icon: 'fas fa-plug',
      description: 'إدارة التكاملات مع الأنظمة الخارجية',
      action: () => toast('التكاملات قيد التطوير', { icon: 'ℹ️' })
    }
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>الإعدادات</PageTitle>
        <PageSubtitle>إدارة إعدادات النظام والتفضيلات الشخصية</PageSubtitle>
      </PageHeader>

      <SettingsGrid>
        {settingsCategories.map((category) => (
          <SettingsCard key={category.id}>
            <CardHeader>
              <CardIcon>
                <i className={category.icon}></i>
              </CardIcon>
              <CardTitle>{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{category.description}</CardDescription>
              <CardActions>
                <Button variant="primary" onClick={category.action}>
                  <i className="fas fa-edit"></i>
                  إدارة
                </Button>
              </CardActions>
            </CardContent>
          </SettingsCard>
        ))}
      </SettingsGrid>

      {/* Profile Settings Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="تحديث الملف الشخصي"
        size="lg"
      >
        <FormContainer>
          <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }}>
            <FormGrid>
              <FormGroup>
                <Label>الاسم الكامل</Label>
                <Input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>رقم الهاتف</Label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>القسم</Label>
                <Input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                  required
                />
              </FormGroup>
            </FormGrid>
            <FormActions>
              <Button type="button" variant="secondary" onClick={() => setShowProfileModal(false)}>
                إلغاء
              </Button>
              <Button type="submit" variant="primary">
                <i className="fas fa-save"></i>
                حفظ التغييرات
              </Button>
            </FormActions>
          </form>
        </FormContainer>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="تغيير كلمة المرور"
        size="md"
      >
        <FormContainer>
          <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }}>
            <FormGroup style={{ marginBottom: '20px' }}>
              <Label>كلمة المرور الحالية</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: '20px' }}>
              <Label>كلمة المرور الجديدة</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: '20px' }}>
              <Label>تأكيد كلمة المرور الجديدة</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </FormGroup>
            <FormActions>
              <Button type="button" variant="secondary" onClick={() => setShowPasswordModal(false)}>
                إلغاء
              </Button>
              <Button type="submit" variant="primary">
                <i className="fas fa-key"></i>
                تغيير كلمة المرور
              </Button>
            </FormActions>
          </form>
        </FormContainer>
      </Modal>

      {/* System Settings Modal */}
      <Modal
        isOpen={showSystemModal}
        onClose={() => setShowSystemModal(false)}
        title="إعدادات النظام"
        size="lg"
      >
        <FormContainer>
          <form onSubmit={(e) => { e.preventDefault(); handleSystemUpdate(); }}>
            <FormGrid>
              <FormGroup>
                <Label>اللغة</Label>
                <Select
                  value={systemSettings.language}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>المنطقة الزمنية</Label>
                <Select
                  value={systemSettings.timezone}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  <option value="Africa/Cairo">القاهرة</option>
                  <option value="UTC">UTC</option>
                </Select>
              </FormGroup>
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <Label>تفعيل الإشعارات</Label>
                  <ToggleSwitch>
                    <ToggleInput
                      type="checkbox"
                      checked={systemSettings.notifications}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                    />
                    <ToggleSlider></ToggleSlider>
                  </ToggleSwitch>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <Label>تنبيهات البريد الإلكتروني</Label>
                  <ToggleSwitch>
                    <ToggleInput
                      type="checkbox"
                      checked={systemSettings.emailAlerts}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, emailAlerts: e.target.checked }))}
                    />
                    <ToggleSlider></ToggleSlider>
                  </ToggleSwitch>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <Label>النسخ الاحتياطي التلقائي</Label>
                  <ToggleSwitch>
                    <ToggleInput
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                    />
                    <ToggleSlider></ToggleSlider>
                  </ToggleSwitch>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Label>وضع الصيانة</Label>
                  <ToggleSwitch>
                    <ToggleInput
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    />
                    <ToggleSlider></ToggleSlider>
                  </ToggleSwitch>
                </div>
              </FormGroup>
            </FormGrid>
            <FormActions>
              <Button type="button" variant="secondary" onClick={() => setShowSystemModal(false)}>
                إلغاء
              </Button>
              <Button type="submit" variant="primary">
                <i className="fas fa-save"></i>
                حفظ الإعدادات
              </Button>
            </FormActions>
          </form>
        </FormContainer>
      </Modal>

      {/* Backup Modal */}
      <Modal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        title="النسخ الاحتياطي"
        size="md"
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', color: '#667eea', marginBottom: '20px' }}>
            <i className="fas fa-database"></i>
          </div>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>
            إدارة النسخ الاحتياطية
          </h3>
          <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>
            يمكنك إنشاء نسخة احتياطية من جميع البيانات أو استعادة نسخة سابقة
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={handleBackup}>
              <i className="fas fa-download"></i>
              إنشاء نسخة احتياطية
            </Button>
            <Button variant="secondary">
              <i className="fas fa-upload"></i>
              استعادة نسخة
            </Button>
            <Button variant="secondary" onClick={() => setShowBackupModal(false)}>
              إغلاق
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default Settings;