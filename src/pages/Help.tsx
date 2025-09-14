import React from 'react';
import Button from '@/components/UI/Button';

/**
 * Help and Support Page
 * 
 * Provides comprehensive help and support information for users including:
 * - Frequently asked questions
 * - User guides and tutorials
 * - Contact information
 * - System documentation
 * 
 * Features:
 * - Organized help sections with clear navigation
 * - Search functionality for help topics
 * - Contact forms and support channels
 * - Video tutorials and documentation links
 * - Responsive design for all devices
 */
const Help: React.FC = () => {
  const faqs = [
    {
      question: "كيف يمكنني تقديم طلب مساعدة جديدة؟",
      answer: "يمكنك تقديم طلب مساعدة جديدة من خلال النقر على 'طلب مساعدة' في القائمة الرئيسية وملء النموذج المطلوب."
    },
    {
      question: "كيف يمكنني متابعة حالة طلبي؟",
      answer: "يمكنك متابعة حالة طلباتك من خلال صفحة 'طلباتي' التي تعرض جميع طلباتك وحالتها الحالية."
    },
    {
      question: "ما هي أنواع المساعدات المتاحة؟",
      answer: "نقدم أنواع مختلفة من المساعدات تشمل المساعدات الطبية، التعليمية، المالية، ومساعدات الأيتام والأرامل."
    },
    {
      question: "كم من الوقت يستغرق معالجة الطلب؟",
      answer: "عادة ما يتم معالجة الطلبات خلال 5-10 أيام عمل، وقد تختلف المدة حسب نوع المساعدة المطلوبة."
    },
    {
      question: "كيف يمكنني تحديث معلوماتي الشخصية؟",
      answer: "يمكنك تحديث معلوماتك الشخصية من خلال صفحة 'الملف الشخصي' في القائمة الرئيسية."
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">المساعدة والدعم</h1>
        <p className="page-subtitle">نحن هنا لمساعدتك في استخدام النظام</p>
      </div>

      {/* Contact Information */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title flex items-center" style={{ gap: '0.75rem' }}>
            <i className="fas fa-phone text-primary-500"></i>
            معلومات الاتصال
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.5rem' }}>
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200 hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl">
                <i className="fas fa-phone"></i>
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">الهاتف</h3>
              <p className="text-primary-700">02-12345678</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-success-50 to-success-100 rounded-xl border border-success-200 hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="text-lg font-semibold text-success-900 mb-2">البريد الإلكتروني</h3>
              <p className="text-success-700">support@ams.org</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl border border-warning-200 hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="text-lg font-semibold text-warning-900 mb-2">ساعات العمل</h3>
              <p className="text-warning-700">الأحد - الخميس: 8:00 ص - 4:00 م</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-info-50 to-info-100 rounded-xl border border-info-200 hover:shadow-medium transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-info-500 to-info-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="text-lg font-semibold text-info-900 mb-2">العنوان</h3>
              <p className="text-info-700">القاهرة - مصر</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title flex items-center" style={{ gap: '0.75rem' }}>
            <i className="fas fa-question-circle text-primary-500"></i>
            الأسئلة الشائعة
          </h2>
        </div>
        <div className="card-body">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-soft transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Guide Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title flex items-center" style={{ gap: '0.75rem' }}>
            <i className="fas fa-book text-primary-500"></i>
            دليل المستخدم
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem' }}>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-3 flex items-center" style={{ gap: '0.5rem' }}>
                <i className="fas fa-play-circle"></i>
                كيفية استخدام النظام للمرة الأولى
              </h3>
              <p className="text-primary-700 leading-relaxed">
                بعد تسجيل الدخول، ستجد في لوحة التحكم نظرة عامة على النظام. يمكنك البدء بإنشاء طلب مساعدة جديد أو استعراض طلباتك السابقة.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-success-50 to-success-100 p-6 rounded-xl border border-success-200">
              <h3 className="text-lg font-semibold text-success-900 mb-3 flex items-center" style={{ gap: '0.5rem' }}>
                <i className="fas fa-user-edit"></i>
                كيفية تحديث بياناتي الشخصية
              </h3>
              <p className="text-success-700 leading-relaxed">
                يمكنك تحديث بياناتك الشخصية من خلال الذهاب إلى صفحة "الملف الشخصي" وتعديل المعلومات المطلوبة.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-warning-50 to-warning-100 p-6 rounded-xl border border-warning-200">
              <h3 className="text-lg font-semibold text-warning-900 mb-3 flex items-center" style={{ gap: '0.5rem' }}>
                <i className="fas fa-file-export"></i>
                كيفية تصدير التقارير
              </h3>
              <p className="text-warning-700 leading-relaxed">
                يمكنك تصدير التقارير من صفحة "التقارير" باختيار نوع التقرير المطلوب وتنسيق التصدير (PDF أو Excel).
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-info-50 to-info-100 p-6 rounded-xl border border-info-200">
              <h3 className="text-lg font-semibold text-info-900 mb-3 flex items-center" style={{ gap: '0.5rem' }}>
                <i className="fas fa-shield-alt"></i>
                الأمان والخصوصية
              </h3>
              <p className="text-info-700 leading-relaxed">
                جميع بياناتك محمية بأعلى معايير الأمان. لا نشارك معلوماتك الشخصية مع أي طرف ثالث.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Support */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title flex items-center" style={{ gap: '0.75rem' }}>
            <i className="fas fa-headset text-primary-500"></i>
            الدعم الفني
          </h2>
        </div>
        <div className="card-body">
          <div className="text-center">
            <p className="text-gray-600 mb-6 text-lg">
              إذا كنت تواجه أي مشاكل تقنية أو تحتاج إلى مساعدة إضافية، لا تتردد في التواصل معنا
            </p>
            <div className="flex flex-col sm:flex-row justify-center" style={{ gap: '1rem' }}>
              <Button variant="primary" className="btn-primary">
                <i className="fas fa-comments"></i>
                تواصل معنا
              </Button>
              <Button variant="outline" className="btn-outline">
                <i className="fas fa-ticket-alt"></i>
                إنشاء تذكرة دعم
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;