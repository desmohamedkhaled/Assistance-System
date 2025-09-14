import React from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { formatCurrency } from '@/utils/format';
import { generateDashboardReport } from '@/utils/export';
import AssistanceTypeChart from '@/components/Charts/AssistanceTypeChart';
import MonthlyAssistanceChart from '@/components/Charts/MonthlyAssistanceChart';
import StatusDistributionChart from '@/components/Charts/StatusDistributionChart';
import ExportButton from '@/components/UI/ExportButton';
import toast from 'react-hot-toast';

const DashboardContainer = styled.div`
  padding: 0;
  animation: fadeIn 0.8s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-200);
  animation: slideInFromTop 0.6s ease-out;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1.3;
  font-weight: 600;
  text-align: right;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 2s ease-in-out infinite;
`;

const PageSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  text-align: right;
  animation: slideInLeft 0.8s ease-out;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  max-height: 300px;
  min-height: 300px;
  perspective: 1000px;
  animation: slideInUp 0.8s ease-out;
`;

const StatCard = styled.div`
  background: var(--bg-primary);
  padding: var(--space-sm);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  animation: slideInRight 0.6s ease-out;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.15);
  margin-bottom: 0;
  text-align: center;
  height: 90px;
  min-height: 90px;
  backdrop-filter: blur(10px);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.2);
  }

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
`;

const StatContent = styled.div`
  h3 {
    font-size: 10px;
    color: #666;
    margin-bottom: 2px;
    font-weight: 500;
    line-height: 1.1;
    text-align: center;
  }
`;

const StatNumber = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 2px;
  line-height: 1.1;
  text-align: center;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 8px;
  font-weight: 500;
  line-height: 1.1;
  justify-content: center;

  &.positive {
    color: #28a745;
  }

  &.negative {
    color: #dc3545;
  }

  i {
    font-size: 6px;
  }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  text-align: right;
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

const QuickActions = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    border-color: rgba(255, 255, 255, 0.2);
  }

  i {
    font-size: 26px;
  }

  span {
    font-size: 15px;
    line-height: 1.3;
  }
`;

const ChartsSection = styled.div`
  margin-bottom: 40px;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 24px;
`;

const ChartCard = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.12);
    border-color: rgba(102, 126, 234, 0.2);
  }

  h3 {
    font-size: 19px;
    color: #333;
    margin-bottom: 24px;
    text-align: center;
    font-weight: 600;
    line-height: 1.3;
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  height: 320px;
  width: 100%;
`;

const Dashboard: React.FC = () => {
  const {
    data,
    loading,
    getTotalBeneficiaries,
    getTotalAssistances,
    getTotalOrganizations,
    getTotalProjects,
    getTotalPaidAmount,
    getTotalPendingAmount,
    getTotalApprovedAmount,
    getMaleBeneficiaries,
    getFemaleBeneficiaries,
    getAverageAssistanceAmount
  } = useApp();

  const handleExport = (format: 'pdf' | 'excel', options?: any) => {
    const dashboardData = {
      totalBeneficiaries: getTotalBeneficiaries(),
      totalAssistances: getTotalAssistances(),
      totalOrganizations: getTotalOrganizations(),
      totalProjects: getTotalProjects(),
      totalPaidAmount: getTotalPaidAmount(),
      totalPendingAmount: getTotalPendingAmount(),
      totalApprovedAmount: getTotalApprovedAmount(),
      maleBeneficiaries: getMaleBeneficiaries(),
      femaleBeneficiaries: getFemaleBeneficiaries(),
      averageAssistanceAmount: getAverageAssistanceAmount()
    };

    if (format === 'pdf') {
      const success = generateDashboardReport(dashboardData);
      if (success) {
        toast.success('تم تصدير التقرير بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير التقرير');
      }
    } else {
      // Excel export logic can be added here
      toast('تصدير Excel قيد التطوير', { icon: 'ℹ️' });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: 'إجمالي المستفيدين',
      value: getTotalBeneficiaries(),
      change: '+12%',
      positive: true
    },
    {
      title: 'إجمالي المساعدات',
      value: getTotalAssistances(),
      change: '+8%',
      positive: true
    },
    {
      title: 'المؤسسات',
      value: getTotalOrganizations(),
      change: '+2%',
      positive: true
    },
    {
      title: 'المشاريع',
      value: getTotalProjects(),
      change: '+5%',
      positive: true
    },
    {
      title: 'المبلغ المدفوع',
      value: formatCurrency(getTotalPaidAmount()),
      change: '+15%',
      positive: true
    },
    {
      title: 'المبلغ المعلق',
      value: formatCurrency(getTotalPendingAmount()),
      change: '-3%',
      positive: false
    },
    {
      title: 'المبلغ المعتمد',
      value: formatCurrency(getTotalApprovedAmount()),
      change: '+10%',
      positive: true
    },
    {
      title: 'المستفيدين الذكور',
      value: getMaleBeneficiaries(),
      change: '+7%',
      positive: true
    },
    {
      title: 'المستفيدين الإناث',
      value: getFemaleBeneficiaries(),
      change: '+9%',
      positive: true
    },
    {
      title: 'متوسط المساعدة',
      value: formatCurrency(getAverageAssistanceAmount()),
      change: '+4%',
      positive: true
    }
  ];

  const quickActions = [
    { icon: 'fas fa-plus', label: 'إضافة مستفيد', path: '/beneficiaries' },
    { icon: 'fas fa-hand-holding-heart', label: 'طلب مساعدة', path: '/request-assistance' },
    { icon: 'fas fa-file-alt', label: 'ملفات المساعدات', path: '/aid-files' },
    { icon: 'fas fa-chart-bar', label: 'التقارير', path: '/reports' },
    { icon: 'fas fa-users', label: 'إدارة المستخدمين', path: '/users' },
    { icon: 'fas fa-cog', label: 'الإعدادات', path: '/settings' }
  ];

  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>لوحة التحكم</PageTitle>
        <PageSubtitle>نظرة عامة على نظام إدارة المساعدات</PageSubtitle>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatContent>
              <h3>{stat.title}</h3>
              <StatNumber>{stat.value}</StatNumber>
              <StatChange className={stat.positive ? 'positive' : 'negative'}>
                <i className={`fas ${stat.positive ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                {stat.change}
              </StatChange>
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Quick Actions */}
      <QuickActions>
        <SectionHeader>
          <SectionTitle>الإجراءات السريعة</SectionTitle>
        </SectionHeader>
        <ActionsGrid>
          {quickActions.map((action, index) => (
            <ActionButton key={index}>
              <i className={action.icon}></i>
              <span>{action.label}</span>
            </ActionButton>
          ))}
        </ActionsGrid>
      </QuickActions>

      {/* Charts Section */}
      <ChartsSection>
        <SectionHeader>
          <SectionTitle>الرسوم البيانية والإحصائيات</SectionTitle>
          <ExportButton 
            onExport={handleExport} 
            dataType="التقرير"
          />
        </SectionHeader>
        <ChartContainer>
          <AssistanceTypeChart type="bar" />
          <MonthlyAssistanceChart />
          <AssistanceTypeChart type="doughnut" />
          <StatusDistributionChart type="pie" />
        </ChartContainer>
      </ChartsSection>
    </DashboardContainer>
  );
};

export default Dashboard;
