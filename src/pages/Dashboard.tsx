import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Assistance } from '@/types';
import { formatCurrency } from '@/utils/format';
import { generateDashboardReport } from '@/utils/export';
import AssistanceTypeChart from '@/components/Charts/AssistanceTypeChart';
import MonthlyAssistanceChart from '@/components/Charts/MonthlyAssistanceChart';
import StatusDistributionChart from '@/components/Charts/StatusDistributionChart';
import ExportButton from '@/components/UI/ExportButton';
import PageTransition from '@/components/UI/PageTransition';
import toast from 'react-hot-toast';

/**
 * Dashboard Component
 * 
 * Main dashboard page providing overview of the assistance management system.
 * Features role-based content display and comprehensive statistics.
 * 
 * Features:
 * - Role-based dashboard content (admin vs beneficiary views)
 * - Interactive statistics cards with hover effects
 * - Quick action buttons for common tasks
 * - Charts and visualizations for data analysis
 * - Responsive design with mobile support
 * - Export functionality for reports
 */

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
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
    getAverageAssistanceAmount,
    getAssistancesByBeneficiary
  } = useApp();

  const handleExport = (format: 'pdf' | 'excel') => {
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
      // Excel export logic
      const success = generateDashboardReport(dashboardData, 'excel');
      if (success) {
        toast.success('تم تصدير التقرير بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تصدير التقرير');
      }
    }
  };

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // Check if user is beneficiary
  const isBeneficiary = user?.role === 'beneficiary';

  // Get user's assistances if beneficiary
  const userAssistances = isBeneficiary ? 
    getAssistancesByBeneficiary(user?.id || 0) : [];

  const stats = isBeneficiary ? [
    {
      title: 'طلباتي',
      value: userAssistances.length,
      change: '+2',
      positive: true,
      path: '/my-requests'
    },
    {
      title: 'الطلبات المعلقة',
      value: userAssistances.filter((a: Assistance) => a.status === 'معلق').length,
      change: '0',
      positive: true,
      path: '/my-requests?status=معلق'
    },
    {
      title: 'الطلبات المعتمدة',
      value: userAssistances.filter((a: Assistance) => a.status === 'معتمد').length,
      change: '+1',
      positive: true,
      path: '/my-requests?status=معتمد'
    },
    {
      title: 'الطلبات المدفوعة',
      value: userAssistances.filter((a: Assistance) => a.status === 'مدفوع').length,
      change: '+1',
      positive: true,
      path: '/my-requests?status=مدفوع'
    },
    {
      title: 'إجمالي المبلغ المستلم',
      value: formatCurrency(userAssistances.filter((a: Assistance) => a.status === 'مدفوع').reduce((sum: number, a: Assistance) => sum + a.amount, 0)),
      change: '+15%',
      positive: true,
      path: '/my-requests?status=مدفوع'
    },
    {
      title: 'المبلغ المعلق',
      value: formatCurrency(userAssistances.filter((a: Assistance) => a.status === 'معلق').reduce((sum: number, a: Assistance) => sum + a.amount, 0)),
      change: '0%',
      positive: true,
      path: '/my-requests?status=معلق'
    }
  ] : [
    {
      title: 'إجمالي المستفيدين',
      value: getTotalBeneficiaries(),
      change: '+12%',
      positive: true,
      path: '/beneficiaries'
    },
    {
      title: 'إجمالي المساعدات',
      value: getTotalAssistances(),
      change: '+8%',
      positive: true,
      path: '/assistances'
    },
    {
      title: 'المؤسسات',
      value: getTotalOrganizations(),
      change: '+2%',
      positive: true,
      path: '/organizations'
    },
    {
      title: 'المشاريع',
      value: getTotalProjects(),
      change: '+5%',
      positive: true,
      path: '/projects'
    },
    {
      title: 'المبلغ المدفوع',
      value: formatCurrency(getTotalPaidAmount()),
      change: '+15%',
      positive: true,
      path: '/assistances?status=مدفوع'
    },
    {
      title: 'المبلغ المعلق',
      value: formatCurrency(getTotalPendingAmount()),
      change: '-3%',
      positive: false,
      path: '/assistances?status=معلق'
    },
    {
      title: 'المبلغ المعتمد',
      value: formatCurrency(getTotalApprovedAmount()),
      change: '+10%',
      positive: true,
      path: '/assistances?status=معتمد'
    },
    {
      title: 'المستفيدين الذكور',
      value: getMaleBeneficiaries(),
      change: '+7%',
      positive: true,
      path: '/beneficiaries?gender=ذكر'
    },
    {
      title: 'المستفيدين الإناث',
      value: getFemaleBeneficiaries(),
      change: '+9%',
      positive: true,
      path: '/beneficiaries?gender=أنثى'
    },
    {
      title: 'متوسط المساعدة',
      value: formatCurrency(getAverageAssistanceAmount()),
      change: '+4%',
      positive: true,
      path: '/reports'
    }
  ];

  const quickActions = isBeneficiary ? [
    { icon: 'fas fa-hand-holding-heart', label: 'طلب مساعدة جديدة', path: '/request-assistance' },
    { icon: 'fas fa-list', label: 'طلباتي', path: '/my-requests' },
    { icon: 'fas fa-info-circle', label: 'معلوماتي الشخصية', path: '/profile' },
    { icon: 'fas fa-question-circle', label: 'المساعدة والدعم', path: '/help' }
  ] : [
    { icon: 'fas fa-plus', label: 'إضافة مستفيد', path: '/beneficiaries' },
    { icon: 'fas fa-hand-holding-heart', label: 'طلب مساعدة', path: '/request-assistance' },
    { icon: 'fas fa-file-alt', label: 'ملفات المساعدات', path: '/aid-files' },
    { icon: 'fas fa-chart-bar', label: 'التقارير', path: '/reports' },
    { icon: 'fas fa-users', label: 'إدارة المستخدمين', path: '/users' },
    { icon: 'fas fa-cog', label: 'الإعدادات', path: '/settings' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 relative z-10">
          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl mb-8 shadow-3xl border border-white/20 transform hover:scale-[1.01] transition-all duration-700 group">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-32 right-10 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-3000"></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/5 rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-white/8 rounded-full animate-pulse delay-1500"></div>
                
                {/* Floating geometric shapes */}
                <div className="absolute top-20 right-1/4 w-6 h-6 bg-white/10 rotate-45 animate-float"></div>
                <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/5 rounded-full animate-float delay-1000"></div>
                <div className="absolute top-1/4 right-1/5 w-8 h-8 bg-white/8 rounded-lg rotate-12 animate-float delay-2000"></div>
              </div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5"></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-white text-center lg:text-right">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl border border-white/30 group-hover:scale-110 transition-transform duration-500">
                      <i className="fas fa-tachometer-alt text-4xl text-white group-hover:rotate-12 transition-transform duration-500"></i>
                    </div>
                    <div className="text-center lg:text-right">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-glow">
                        {isBeneficiary ? `مرحباً ${user?.fullName}` : 'لوحة التحكم'}
                      </h1>
                      <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 font-medium leading-relaxed">
                        {isBeneficiary ? 'نظرة عامة على طلباتك وحالة مساعداتك' : 'نظرة عامة على نظام إدارة المساعدات'}
                      </p>
                    </div>
                  </div>
                  
                  {!isBeneficiary && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <i className="fas fa-calendar-alt text-white text-sm"></i>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium">آخر تحديث</p>
                          <p className="font-bold text-sm">{new Date().toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <i className="fas fa-clock text-white text-sm"></i>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium">الوقت الحالي</p>
                          <p className="font-bold text-sm">{new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {!isBeneficiary && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-3xl group-hover:scale-105 transition-transform duration-500">
                      <i className="fas fa-chart-line text-6xl text-white group-hover:rotate-12 transition-transform duration-500"></i>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                      <p className="text-white/80 text-base font-medium">نظام إدارة المساعدات</p>
                      <p className="text-white font-bold text-xl">v2.1.0</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 flex items-center gap-4 text-center sm:text-right">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl animate-float">
                  <i className="fas fa-chart-bar text-white text-2xl"></i>
                </div>
                الإحصائيات الرئيسية
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border border-blue-200 shadow-sm">
                <i className="fas fa-info-circle text-blue-500 text-base animate-pulse"></i>
                <span className="font-medium">انقر على أي بطاقة للانتقال للتفاصيل</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
              {stats.map((stat, index) => {
                const colors = [
                  'from-blue-500 to-blue-600',
                  'from-emerald-500 to-emerald-600', 
                  'from-purple-500 to-purple-600',
                  'from-orange-500 to-orange-600',
                  'from-red-500 to-red-600',
                  'from-teal-500 to-teal-600',
                  'from-indigo-500 to-indigo-600',
                  'from-pink-500 to-pink-600',
                  'from-amber-500 to-amber-600',
                  'from-cyan-500 to-cyan-600'
                ];
                const icons = [
                  'fa-users', 'fa-hand-holding-heart', 'fa-chart-bar', 'fa-money-bill-wave',
                  'fa-building', 'fa-project-diagram', 'fa-user-tie', 'fa-chart-pie',
                  'fa-coins', 'fa-percentage'
                ];
                
                return (
                  <div 
                    key={index} 
                    className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200 animate-slide-in-up hover:scale-105 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleQuickAction(stat.path)}
                  >
                    {/* Gradient Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" 
                         style={{ background: `linear-gradient(135deg, ${colors[index % colors.length].split(' ')[1]}, ${colors[index % colors.length].split(' ')[3]})` }}></div>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    {/* Top Accent Border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-indigo-300 transition-colors duration-500"></div>
                    
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-20 h-20 bg-gradient-to-br ${colors[index % colors.length]} rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                          <i className={`fas ${icons[index % icons.length]} text-white text-2xl relative z-10`}></i>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 group-hover:scale-105 ${
                          stat.positive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-200' : 'bg-red-100 text-red-700 border border-red-200 group-hover:bg-red-200'
                        }`}>
                          <i className={`fas ${stat.positive ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs`}></i>
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">{stat.title}</h3>
                        <p className="text-4xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 group-hover:scale-105 transform transition-transform duration-300">
                          {stat.value}
                        </p>
                      </div>
                      
                      <div className="mt-6 flex items-center text-sm text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                        <i className="fas fa-mouse-pointer mr-2 text-base group-hover:animate-bounce"></i>
                        <span className="font-medium">انقر للتفاصيل</span>
                        <i className="fas fa-arrow-left mr-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                      </div>
                    </div>
                    
                    {/* Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-indigo-300 transition-colors duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3 text-center sm:text-right">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float">
                      <i className="fas fa-bolt text-lg"></i>
                    </div>
                    الإجراءات السريعة
                  </h2>
                  <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                    <i className="fas fa-magic animate-pulse"></i>
                    <span className="text-sm font-medium">اختر الإجراء المناسب</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const actionColors = [
                    'from-blue-500 to-blue-600',
                    'from-emerald-500 to-emerald-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-red-500 to-red-600',
                    'from-teal-500 to-teal-600'
                  ];
                  
                  return (
                    <button
                      key={index}
                      className="group relative overflow-hidden bg-gradient-to-br hover:shadow-xl transition-all duration-500 hover:scale-105 rounded-2xl border border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
                      style={{ 
                        background: `linear-gradient(135deg, ${actionColors[index % actionColors.length].split(' ')[1]}, ${actionColors[index % actionColors.length].split(' ')[3]})`
                      }}
                      onClick={() => handleQuickAction(action.path)}
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      
                      {/* Top Accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 group-hover:bg-white/30 transition-colors duration-300"></div>
                      
                      <div className="relative z-10 flex flex-col items-center p-6 text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                          <i className={`${action.icon} text-2xl relative z-10`}></i>
                        </div>
                        <span className="text-center leading-relaxed font-semibold text-base mb-3 group-hover:scale-105 transition-transform duration-300">{action.label}</span>
                        <div className="flex items-center gap-2 text-white/80 text-xs group-hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg group-hover:bg-white/20">
                          <i className="fas fa-arrow-left group-hover:translate-x-1 transition-transform duration-300"></i>
                          <span className="font-medium">انقر للانتقال</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                        <i className="fas fa-external-link-alt text-xs"></i>
                      </div>
                      
                      {/* Bottom Accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 group-hover:bg-white/30 transition-colors duration-300"></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Charts Section - Only for non-beneficiaries */}
          {!isBeneficiary && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3 text-center sm:text-right">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float">
                        <i className="fas fa-chart-pie text-lg"></i>
                      </div>
                      الرسوم البيانية والإحصائيات
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                        <i className="fas fa-download animate-pulse"></i>
                        <span className="text-sm font-medium">تصدير التقارير</span>
                      </div>
                      <ExportButton 
                        onExport={handleExport} 
                        dataType="التقرير"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-chart-bar text-white text-sm"></i>
                      </div>
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">أنواع المساعدات</h3>
                    </div>
                    <AssistanceTypeChart type="bar" />
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-chart-line text-white text-sm"></i>
                      </div>
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">المساعدات الشهرية</h3>
                    </div>
                    <MonthlyAssistanceChart />
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-chart-pie text-white text-sm"></i>
                      </div>
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">توزيع أنواع المساعدات</h3>
                    </div>
                    <AssistanceTypeChart type="doughnut" />
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl border border-orange-100 hover:shadow-xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-chart-area text-white text-sm"></i>
                      </div>
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">توزيع الحالات</h3>
                    </div>
                    <StatusDistributionChart type="pie" />
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;

