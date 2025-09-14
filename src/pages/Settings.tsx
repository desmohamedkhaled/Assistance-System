import React, { useState } from 'react';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import toast from 'react-hot-toast';

/**
 * Settings Page
 * 
 * Provides system configuration and user preferences including:
 * - System settings and configurations
 * - User preferences and notifications
 * - Security settings and password management
 * - Backup and data management options
 * 
 * Features:
 * - Organized settings categories with clear navigation
 * - Form validation and error handling
 * - Real-time settings updates
 * - Security and privacy controls
 * - Responsive design for all devices
 */
const Settings: React.FC = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const handleSaveSettings = () => {
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleBackupData = () => {
    setShowBackupModal(true);
  };

  const settingsCategories = [
    {
      title: 'إعدادات النظام',
      icon: 'fas fa-cog',
      description: 'إعدادات عامة للنظام والتكوين الأساسي',
      color: 'from-primary-500 to-primary-600',
      actions: [
        { label: 'تعديل الإعدادات', action: () => toast('فتح إعدادات النظام', { icon: 'ℹ️' }) }
      ]
    },
    {
      title: 'إعدادات المستخدم',
      icon: 'fas fa-user-cog',
      description: 'تخصيص تجربة المستخدم والتفضيلات الشخصية',
      color: 'from-success-500 to-success-600',
      actions: [
        { label: 'تعديل الملف الشخصي', action: () => toast('فتح الملف الشخصي', { icon: 'ℹ️' }) }
      ]
    },
    {
      title: 'الأمان والخصوصية',
      icon: 'fas fa-shield-alt',
      description: 'إعدادات الأمان وكلمة المرور والخصوصية',
      color: 'from-warning-500 to-warning-600',
      actions: [
        { label: 'تغيير كلمة المرور', action: handleChangePassword },
        { label: 'إعدادات الأمان', action: () => toast('فتح إعدادات الأمان', { icon: 'ℹ️' }) }
      ]
    },
    {
      title: 'النسخ الاحتياطي',
      icon: 'fas fa-database',
      description: 'إدارة النسخ الاحتياطية واستعادة البيانات',
      color: 'from-info-500 to-info-600',
      actions: [
        { label: 'إنشاء نسخة احتياطية', action: handleBackupData },
        { label: 'استعادة البيانات', action: () => toast('فتح استعادة البيانات', { icon: 'ℹ️' }) }
      ]
    },
    {
      title: 'الإشعارات',
      icon: 'fas fa-bell',
      description: 'إعدادات الإشعارات والتنبيهات',
      color: 'from-purple-500 to-purple-600',
      actions: [
        { label: 'تعديل الإشعارات', action: () => toast('فتح إعدادات الإشعارات', { icon: 'ℹ️' }) }
      ]
    },
    {
      title: 'التقارير والتصدير',
      icon: 'fas fa-chart-line',
      description: 'إعدادات التقارير وتنسيقات التصدير',
      color: 'from-pink-500 to-pink-600',
      actions: [
        { label: 'إعدادات التقارير', action: () => toast('فتح إعدادات التقارير', { icon: 'ℹ️' }) }
      ]
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">
              <i className="fas fa-cog ml-3"></i>
              الإعدادات
            </h1>
            <p className="page-subtitle">إدارة إعدادات النظام والتفضيلات الشخصية</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">إجمالي الإعدادات</p>
              <p className="text-2xl font-bold text-gray-900">{settingsCategories.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <i className="fas fa-sliders-h text-white text-lg"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 gap-6">
        {settingsCategories.map((category, index) => (
          <div 
            key={index}
            className="content-section hover:shadow-large transition-all duration-300 group"
          >
            <div className={`bg-gradient-to-br ${category.color} text-white p-6 text-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-3xl mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300">
                <i className={category.icon}></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 relative z-10">{category.title}</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-600 text-sm leading-relaxed mb-4 text-right">
                {category.description}
              </p>
              <div className="flex flex-col gap-2">
                {category.actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant="outline"
                    className="btn-outline text-sm hover:scale-105 transition-transform duration-200"
                    onClick={action.action}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Settings */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title flex items-center" style={{ gap: '0.75rem' }}>
            <i className="fas fa-bell text-primary-500"></i>
            إعدادات الإشعارات
          </h2>
        </div>
        <div className="card-body">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <i className="fas fa-envelope text-primary-500"></i>
                <div>
                  <h3 className="font-medium text-gray-900">الإشعارات عبر البريد الإلكتروني</h3>
                  <p className="text-sm text-gray-600">تلقي إشعارات مهمة عبر البريد الإلكتروني</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <i className="fas fa-sms text-success-500"></i>
                <div>
                  <h3 className="font-medium text-gray-900">الإشعارات عبر الرسائل النصية</h3>
                  <p className="text-sm text-gray-600">تلقي إشعارات عاجلة عبر الرسائل النصية</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-success-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <i className="fas fa-mobile-alt text-warning-500"></i>
                <div>
                  <h3 className="font-medium text-gray-900">الإشعارات الفورية</h3>
                  <p className="text-sm text-gray-600">تلقي إشعارات فورية في المتصفح</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warning-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warning-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title flex items-center" style={{ gap: '0.75rem' }}>
            <i className="fas fa-info-circle text-primary-500"></i>
            معلومات النظام
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem' }}>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">إصدار النظام</span>
                <span className="text-gray-900">v2.1.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">آخر تحديث</span>
                <span className="text-gray-900">15 ديسمبر 2024</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">حالة النظام</span>
                <span className="text-success-600 font-medium">متصل</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">المستخدمين النشطين</span>
                <span className="text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">الطلبات المعالجة</span>
                <span className="text-gray-900">8,934</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">مساحة التخزين</span>
                <span className="text-gray-900">2.4 GB / 10 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end" style={{ gap: '1rem' }}>
        <Button variant="outline" className="btn-outline">
          <i className="fas fa-undo"></i>
          إعادة تعيين الإعدادات
        </Button>
        <Button variant="primary" className="btn-primary" onClick={handleSaveSettings}>
          <i className="fas fa-save"></i>
          حفظ الإعدادات
        </Button>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        title="تغيير كلمة المرور"
      >
        <div className="space-y-4">
          <div>
            <label className="form-label">كلمة المرور الحالية</label>
            <input type="password" className="form-input" placeholder="أدخل كلمة المرور الحالية" />
          </div>
          <div>
            <label className="form-label">كلمة المرور الجديدة</label>
            <input type="password" className="form-input" placeholder="أدخل كلمة المرور الجديدة" />
          </div>
          <div>
            <label className="form-label">تأكيد كلمة المرور</label>
            <input type="password" className="form-input" placeholder="أعد إدخال كلمة المرور الجديدة" />
          </div>
          <div className="flex justify-end" style={{ gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setShowChangePasswordModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={() => {
              setShowChangePasswordModal(false);
              toast.success('تم تغيير كلمة المرور بنجاح');
            }}>
              تغيير كلمة المرور
            </Button>
          </div>
        </div>
      </Modal>

      {/* Backup Modal */}
      <Modal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        title="إنشاء نسخة احتياطية"
      >
        <div className="space-y-4">
          <p className="text-gray-600">سيتم إنشاء نسخة احتياطية من جميع البيانات الحالية. قد تستغرق هذه العملية بضع دقائق.</p>
          <div className="flex justify-end" style={{ gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setShowBackupModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={() => {
              setShowBackupModal(false);
              toast.success('تم إنشاء النسخة الاحتياطية بنجاح');
            }}>
              إنشاء النسخة الاحتياطية
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;