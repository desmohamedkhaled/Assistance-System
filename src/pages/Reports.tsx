import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { generateDashboardReport } from '@/utils/export';
import AssistanceTypeChart from '@/components/Charts/AssistanceTypeChart';
import MonthlyAssistanceChart from '@/components/Charts/MonthlyAssistanceChart';
import StatusDistributionChart from '@/components/Charts/StatusDistributionChart';
import Button from '@/components/UI/Button';
import ExportButton from '@/components/UI/ExportButton';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);

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
  font-size: 42px;
  color: white;
  margin-bottom: 12px;
  line-height: 1.2;
  font-weight: 800;
  text-align: right;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  line-height: 1.6;
  margin: 0;
  text-align: right;
  position: relative;
  z-index: 1;
  font-weight: 500;
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(84, 124, 140, 0.1);
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(84, 124, 140, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #547c8c 0%, #3d5260 100%);
  }
`;

const ReportHeader = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #547c8c 0%, #3d5260 100%);
  color: white;
  text-align: center;
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
    opacity: 0.2;
    animation: float 20s ease-in-out infinite;
  }
`;

const ReportIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;

  ${ReportCard}:hover & {
    transform: scale(1.15);
  }
`;

const ReportTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  position: relative;
  z-index: 1;
`;

const ReportContent = styled.div`
  padding: 32px;
`;

const ReportDescription = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 28px;
  text-align: right;
  font-weight: 500;
`;

const ReportActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ChartsSection = styled.div`
  margin-top: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(23, 162, 184, 0.1);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #17a2b8 0%, #20c997 100%);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px 24px 0 24px;
`;

const SectionTitle = styled.h2`
  font-size: 26px;
  color: #333;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  padding: 0 24px 24px 24px;
`;

const Reports: React.FC = () => {
  const { data, loading } = useApp();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const handleExport = (format: 'pdf' | 'excel') => {
    const dashboardData = {
      totalBeneficiaries: data.beneficiaries.length,
      totalAssistances: data.assistances.length,
      totalOrganizations: data.organizations.length,
      totalProjects: data.projects.length,
      totalPaidAmount: data.assistances
        .filter(a => a.status === 'مدفوع')
        .reduce((sum, a) => sum + a.amount, 0),
      totalPendingAmount: data.assistances
        .filter(a => a.status === 'معلق')
        .reduce((sum, a) => sum + a.amount, 0),
      totalApprovedAmount: data.assistances
        .filter(a => a.status === 'معتمد')
        .reduce((sum, a) => sum + a.amount, 0),
      maleBeneficiaries: data.beneficiaries.filter(b => b.gender === 'ذكر').length,
      femaleBeneficiaries: data.beneficiaries.filter(b => b.gender === 'أنثى').length,
      averageAssistanceAmount: data.assistances.length > 0 
        ? data.assistances.reduce((sum, a) => sum + a.amount, 0) / data.assistances.length 
        : 0
    };

    if (format === 'pdf') {
      const success = generateDashboardReport(dashboardData);
      if (success) {
        toast.success('تم تصدير التقرير بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير التقرير');
      }
    } else {
      const success = generateDashboardReport(dashboardData, 'excel');
      if (success) {
        toast.success('تم تصدير التقرير بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير التقرير');
      }
    }
  };

  const reports = [
    {
      id: 'beneficiaries',
      title: 'تقرير المستفيدين',
      icon: 'fas fa-users',
      description: 'تقرير شامل عن جميع المستفيدين المسجلين في النظام مع تفاصيلهم الشخصية والإحصائيات',
      action: () => setSelectedReport('beneficiaries')
    },
    {
      id: 'assistances',
      title: 'تقرير المساعدات',
      icon: 'fas fa-hand-holding-heart',
      description: 'تقرير مفصل عن جميع المساعدات المقدمة مع تصنيفها حسب النوع والحالة',
      action: () => setSelectedReport('assistances')
    },
    {
      id: 'financial',
      title: 'التقرير المالي',
      icon: 'fas fa-money-bill-wave',
      description: 'تقرير مالي شامل عن المبالغ المدفوعة والمعلقة والمعتمدة',
      action: () => setSelectedReport('financial')
    },
    {
      id: 'organizations',
      title: 'تقرير المؤسسات',
      icon: 'fas fa-building',
      description: 'تقرير عن المؤسسات الشريكة والمشاريع المنفذة',
      action: () => setSelectedReport('organizations')
    },
    {
      id: 'monthly',
      title: 'التقرير الشهري',
      icon: 'fas fa-calendar-alt',
      description: 'تقرير شهري عن نشاط المساعدات والمستفيدين الجدد',
      action: () => setSelectedReport('monthly')
    },
    {
      id: 'statistics',
      title: 'الإحصائيات العامة',
      icon: 'fas fa-chart-pie',
      description: 'إحصائيات شاملة ومؤشرات الأداء الرئيسية للنظام',
      action: () => setSelectedReport('statistics')
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
              <i className="fas fa-chart-line ml-3"></i>
              التقارير
            </PageTitle>
            <PageSubtitle>تقارير شاملة عن المساعدات والمستفيدين</PageSubtitle>
            {selectedReport && (
              <div className="mt-2 text-sm text-white/80">
                التقرير المحدد: {selectedReport}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">إجمالي التقارير</p>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
            </div>
            <div className="w-16 h-16 bg-white/20  rounded-full flex items-center justify-center">
              <i className="fas fa-file-chart-line text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </PageHeader>

      <ReportsGrid>
        {reports.map((report) => (
          <ReportCard key={report.id}>
            <ReportHeader>
              <ReportIcon>
                <i className={report.icon}></i>
              </ReportIcon>
              <ReportTitle>{report.title}</ReportTitle>
            </ReportHeader>
            <ReportContent>
              <ReportDescription>{report.description}</ReportDescription>
              <ReportActions>
                <Button variant="primary" onClick={report.action}>
                  <i className="fas fa-eye"></i>
                  عرض التقرير
                </Button>
                <Button variant="secondary">
                  <i className="fas fa-download"></i>
                  تصدير
                </Button>
              </ReportActions>
            </ReportContent>
          </ReportCard>
        ))}
      </ReportsGrid>

      <ChartsSection>
        <SectionHeader>
          <SectionTitle>
            <i className="fas fa-chart-pie text-info-500"></i>
            الرسوم البيانية التفاعلية
          </SectionTitle>
          <ExportButton 
            onExport={handleExport} 
            dataType="التقارير"
          />
        </SectionHeader>
        <ChartsGrid>
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <AssistanceTypeChart type="bar" />
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <MonthlyAssistanceChart />
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <AssistanceTypeChart type="doughnut" />
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <StatusDistributionChart type="pie" />
          </div>
        </ChartsGrid>
      </ChartsSection>
    </PageContainer>
  );
};

export default Reports;