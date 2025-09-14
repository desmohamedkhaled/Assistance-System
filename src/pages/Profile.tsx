import React from 'react';
import { useAuth } from '@/context/AuthContext';
import styled from 'styled-components';
import Button from '@/components/UI/Button';

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
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

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(111, 66, 193, 0.1);
  padding: 40px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6f42c1 0%, #e83e8c 100%);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f3f4;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
  box-shadow: 0 8px 24px rgba(111, 66, 193, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 28px;
  color: #333;
  margin: 0 0 12px 0;
  font-weight: 700;
`;

const UserRole = styled.div`
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
`;

const InfoItem = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #6f42c1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6f42c1 0%, #e83e8c 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f3f4;
`;

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>الملف الشخصي</PageTitle>
          <PageSubtitle>لا يمكن عرض الملف الشخصي</PageSubtitle>
        </PageHeader>
      </PageContainer>
    );
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      'admin': 'مدير النظام',
      'branch_manager': 'مدير فرع',
      'staff': 'موظف',
      'approver': 'لجنة الموافقات',
      'beneficiary': 'مستفيد'
    };
    return roleLabels[role] || role;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex items-center justify-between">
          <div>
            <PageTitle>
              <i className="fas fa-user ml-3"></i>
              الملف الشخصي
            </PageTitle>
            <PageSubtitle>معلوماتك الشخصية وإعدادات الحساب</PageSubtitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">حالة الحساب</p>
              <p className="text-lg font-bold text-white">{user.status === 'active' ? 'نشط' : 'غير نشط'}</p>
            </div>
            <div className="w-16 h-16 bg-white/20  rounded-full flex items-center justify-center">
              <i className="fas fa-user-circle text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </PageHeader>

      <ProfileCard>
        <ProfileHeader>
          <Avatar>
            {getInitials(user.fullName)}
          </Avatar>
          <UserInfo>
            <UserName>{user.fullName}</UserName>
            <UserRole>{getRoleLabel(user.role)}</UserRole>
          </UserInfo>
        </ProfileHeader>

        <InfoGrid>
          <InfoItem>
            <InfoLabel>اسم المستخدم</InfoLabel>
            <InfoValue>{user.username}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>البريد الإلكتروني</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>رقم الهاتف</InfoLabel>
            <InfoValue>{user.phone}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>تاريخ إنشاء الحساب</InfoLabel>
            <InfoValue>{user.createdAt}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>حالة الحساب</InfoLabel>
            <InfoValue style={{ color: user.status === 'active' ? '#28a745' : '#dc3545' }}>
              {user.status === 'active' ? 'نشط' : 'غير نشط'}
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>الصلاحيات</InfoLabel>
            <InfoValue>
              {user.permissions?.join(', ') || 'لا توجد صلاحيات محددة'}
            </InfoValue>
          </InfoItem>
        </InfoGrid>

        <ActionsContainer>
          <Button variant="secondary">
            <i className="fas fa-edit"></i>
            تعديل الملف الشخصي
          </Button>
          <Button variant="primary">
            <i className="fas fa-key"></i>
            تغيير كلمة المرور
          </Button>
        </ActionsContainer>
      </ProfileCard>
    </PageContainer>
  );
};

export default Profile;
