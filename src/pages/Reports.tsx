import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';
import { formatCurrency, formatDate } from '@/utils/format';
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

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const ReportCard = styled.div`
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

const ReportHeader = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const ReportIcon = styled.div`
  font-size: 32px;
  margin-bottom: 10px;
`;

const ReportTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const ReportContent = styled.div`
  padding: 20px;
`;

const ReportDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: right;
`;

const ReportActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ChartsSection = styled.div`
  margin-top: 30px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #333;
  font-weight: 600;
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
`;

const Reports: React.FC = () => {
  const { data, loading } = useApp();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleExport = (format: 'pdf' | 'excel', options?: any) => {
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
      toast('تصدير Excel قيد التطوير', { icon: 'ℹ️' });
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
        <PageTitle>التقارير</PageTitle>
        <PageSubtitle>تقارير شاملة عن المساعدات والمستفيدين</PageSubtitle>
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
          <SectionTitle>الرسوم البيانية التفاعلية</SectionTitle>
          <ExportButton 
            onExport={handleExport} 
            dataType="التقارير"
          />
        </SectionHeader>
        <ChartsGrid>
          <AssistanceTypeChart type="bar" />
          <MonthlyAssistanceChart />
          <AssistanceTypeChart type="doughnut" />
          <StatusDistributionChart type="pie" />
        </ChartsGrid>
      </ChartsSection>
    </PageContainer>
  );
};

export default Reports;