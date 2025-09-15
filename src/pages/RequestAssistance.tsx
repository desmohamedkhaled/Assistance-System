import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import PageTransition from '@/components/UI/PageTransition';
import toast from 'react-hot-toast';

/**
 * Enhanced Request Assistance Form
 * 
 * Comprehensive form for requesting assistance with three main sections:
 * 1. Personal Information (المعلومات الشخصية)
 * 2. Assistance Details (تفاصيل طلب المساعدة)
 * 3. Attachments (المرفقات)
 */

interface FormData {
  // Personal Information
  fullName: string;
  nationalId: string;
  phone: string;
  gender: 'ذكر' | 'أنثى' | '';
  religion: 'مسلم' | 'مسلمة' | 'مسيحي' | 'مسيحية' | 'أخرى' | '';
  maritalStatus: 'عازب' | 'عزباء' | 'متزوج' | 'متزوجة' | 'مطلق' | 'مطلقة' | 'أرمل' | 'أرملة' | '';
  familyMembers: string;
  income: string;
  
  // Assistance Information
  assistanceType: 'مالية' | 'علاجية' | 'تعليمية' | 'طبية' | 'أيتام' | 'أرامل' | 'ذوي الاحتياجات' | 'أسر السجناء' | '';
  amount: string;
  paymentMethod: 'نقدي' | 'تحويل بنكي' | 'شيك' | 'حساب داخلي' | 'فيزا' | '';
  notes: string;
  
  // Attachments
  nationalIdImage: File | null;
  supportingDocument: File | null;
}

interface FormErrors {
  fullName?: string;
  nationalId?: string;
  phone?: string;
  gender?: string;
  religion?: string;
  maritalStatus?: string;
  familyMembers?: string;
  income?: string;
  assistanceType?: string;
  amount?: string;
  paymentMethod?: string;
  notes?: string;
  nationalIdImage?: string;
  supportingDocument?: string;
}

const RequestAssistance: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    nationalId: '',
    phone: '',
    gender: '',
    religion: '',
    maritalStatus: '',
    familyMembers: '',
    income: '',
    assistanceType: '',
    amount: '',
    paymentMethod: '',
    notes: '',
    nationalIdImage: null,
    supportingDocument: null
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'nationalIdImage' | 'supportingDocument') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    
    // Clear error when file is selected
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Personal Information Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم بالكامل مطلوب';
    }
    
    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'الرقم القومي مطلوب';
    } else if (!/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'الرقم القومي يجب أن يكون 14 رقم';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'النوع مطلوب';
    }
    
    if (!formData.religion) {
      newErrors.religion = 'الديانة مطلوبة';
    }
    
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'الحالة الاجتماعية مطلوبة';
    }
    
    if (!formData.familyMembers) {
      newErrors.familyMembers = 'عدد أفراد الأسرة مطلوب';
    } else if (parseInt(formData.familyMembers) < 1) {
      newErrors.familyMembers = 'عدد أفراد الأسرة يجب أن يكون أكبر من صفر';
    }
    
    if (!formData.income) {
      newErrors.income = 'الدخل الشهري مطلوب';
    } else if (parseFloat(formData.income) < 0) {
      newErrors.income = 'الدخل الشهري يجب أن يكون أكبر من أو يساوي صفر';
    }

    // Assistance Information Validation
    if (!formData.assistanceType) {
      newErrors.assistanceType = 'نوع المساعدة مطلوب';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'المبلغ المطلوب مطلوب';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'المبلغ المطلوب يجب أن يكون أكبر من صفر';
    } else if (parseFloat(formData.amount) > 1000000) {
      newErrors.amount = 'المبلغ المطلوب كبير جداً';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'طريقة الصرف مطلوبة';
    }

    // Attachments Validation
    if (!formData.nationalIdImage) {
      newErrors.nationalIdImage = 'صورة بطاقة الرقم القومي مطلوبة';
    }
    
    if (!formData.supportingDocument) {
      newErrors.supportingDocument = 'المستند الداعم مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccessModal(true);
      toast.success('تم إرسال طلب المساعدة بنجاح');
      
      // Reset form
      setFormData({
        fullName: '',
        nationalId: '',
        phone: '',
        gender: '',
        religion: '',
        maritalStatus: '',
        familyMembers: '',
        income: '',
        assistanceType: '',
        amount: '',
        paymentMethod: '',
        notes: '',
        nationalIdImage: null,
        supportingDocument: null
      });
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      nationalId: '',
      phone: '',
      gender: '',
      religion: '',
      maritalStatus: '',
      familyMembers: '',
      income: '',
      assistanceType: '',
      amount: '',
      paymentMethod: '',
      notes: '',
      nationalIdImage: null,
      supportingDocument: null
    });
    setErrors({});
  };

  const assistanceTypes = [
    { value: 'مالية', label: 'مالية' },
    { value: 'علاجية', label: 'علاجية' },
    { value: 'تعليمية', label: 'تعليمية' },
    { value: 'طبية', label: 'طبية' },
    { value: 'أيتام', label: 'أيتام' },
    { value: 'أرامل', label: 'أرامل' },
    { value: 'ذوي الاحتياجات', label: 'ذوي الاحتياجات' },
    { value: 'أسر السجناء', label: 'أسر السجناء' }
  ];

  const paymentMethods = [
    { value: 'نقدي', label: 'نقدي' },
    { value: 'تحويل بنكي', label: 'تحويل بنكي' },
    { value: 'شيك', label: 'شيك' },
    { value: 'حساب داخلي', label: 'حساب داخلي' },
    { value: 'فيزا', label: 'فيزا' }
  ];

  const genders = [
    { value: 'ذكر', label: 'ذكر' },
    { value: 'أنثى', label: 'أنثى' }
  ];

  const religions = [
    { value: 'مسلم', label: 'مسلم' },
    { value: 'مسلمة', label: 'مسلمة' },
    { value: 'مسيحي', label: 'مسيحي' },
    { value: 'مسيحية', label: 'مسيحية' },
    { value: 'أخرى', label: 'أخرى' }
  ];

  const maritalStatuses = [
    { value: 'عازب', label: 'عازب' },
    { value: 'عزباء', label: 'عزباء' },
    { value: 'متزوج', label: 'متزوج' },
    { value: 'متزوجة', label: 'متزوجة' },
    { value: 'مطلق', label: 'مطلق' },
    { value: 'مطلقة', label: 'مطلقة' },
    { value: 'أرمل', label: 'أرمل' },
    { value: 'أرملة', label: 'أرملة' }
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl mb-8 shadow-3xl border border-white/20">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
            </div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6">
                  <i className="fas fa-hand-holding-heart text-4xl text-white"></i>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  طلب مساعدة جديدة
                </h1>
                <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
          {user?.role === 'beneficiary' 
            ? `مرحباً ${user.fullName}، يمكنك تقديم طلب مساعدة جديدة`
            : 'تقديم طلب مساعدة جديدة للمستفيدين'
          }
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              {/* Personal Information Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-user text-white text-xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">المعلومات الشخصية</h2>
                    <p className="text-gray-600">يرجى ملء جميع البيانات الشخصية بدقة</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Full Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      الاسم بالكامل
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="أدخل الاسم بالكامل"
                      dir="rtl"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      الرقم القومي
                    </label>
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.nationalId ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="14 رقم"
                      maxLength={14}
                      dir="ltr"
                    />
                    {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      النوع
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                    >
                      <option value="">اختر النوع</option>
                      {genders.map(gender => (
                        <option key={gender.value} value={gender.value}>{gender.label}</option>
                      ))}
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  {/* Religion */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      الديانة
                    </label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.religion ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                    >
                      <option value="">اختر الديانة</option>
                      {religions.map(religion => (
                        <option key={religion.value} value={religion.value}>{religion.label}</option>
                      ))}
                    </select>
                    {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion}</p>}
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      الحالة الاجتماعية
                    </label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.maritalStatus ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                    >
                      <option value="">اختر الحالة الاجتماعية</option>
                      {maritalStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                    {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
                  </div>

                  {/* Family Members */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      عدد أفراد الأسرة
                    </label>
                    <input
                      type="number"
                      name="familyMembers"
                      value={formData.familyMembers}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.familyMembers ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="عدد الأفراد"
                      min="1"
                    />
                    {errors.familyMembers && <p className="text-red-500 text-sm mt-1">{errors.familyMembers}</p>}
                  </div>

                  {/* Income */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      الدخل الشهري (جنيه مصري)
                    </label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.income ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="المبلغ الشهري"
                      min="0"
                      step="0.01"
                    />
                    {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
                  </div>
                </div>
              </div>

              {/* Assistance Information Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-hand-holding-heart text-white text-xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">تفاصيل طلب المساعدة</h2>
                    <p className="text-gray-600">حدد نوع المساعدة والمبلغ المطلوب</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Assistance Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                نوع المساعدة
                    </label>
                    <select
                name="assistanceType"
                value={formData.assistanceType}
                onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.assistanceType ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
              >
                <option value="">اختر نوع المساعدة</option>
                {assistanceTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {errors.assistanceType && <p className="text-red-500 text-sm mt-1">{errors.assistanceType}</p>}
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                المبلغ المطلوب (جنيه مصري)
                    </label>
                    <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="المبلغ المطلوب"
                min="0"
                step="0.01"
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      طريقة الصرف
                    </label>
                    <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                        errors.paymentMethod ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                      }`}
              >
                      <option value="">اختر طريقة الصرف</option>
                {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                    {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500"
                placeholder="أضف أي ملاحظات أو تفاصيل إضافية حول طلب المساعدة..."
                      rows={4}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-paperclip text-white text-xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">المرفقات</h2>
                    <p className="text-gray-600">يرجى رفع المستندات المطلوبة</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* National ID Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      صورة بطاقة الرقم القومي
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'nationalIdImage')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                          errors.nationalIdImage ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                        }`}
                      />
                      {formData.nationalIdImage && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            <i className="fas fa-check-circle mr-2"></i>
                            تم اختيار الملف: {formData.nationalIdImage.name}
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.nationalIdImage && <p className="text-red-500 text-sm mt-1">{errors.nationalIdImage}</p>}
                  </div>

                  {/* Supporting Document */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      مستند داعم
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'supportingDocument')}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                          errors.supportingDocument ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-500'
                        }`}
                      />
                      {formData.supportingDocument && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            <i className="fas fa-check-circle mr-2"></i>
                            تم اختيار الملف: {formData.supportingDocument.name}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      (شهادة مرضية / فاتورة / قسيمة زواج / إلخ)
                    </p>
                    {errors.supportingDocument && <p className="text-red-500 text-sm mt-1">{errors.supportingDocument}</p>}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
                  onClick={resetForm}
                  className="px-8 py-3"
                >
                  <i className="fas fa-undo mr-2"></i>
              إعادة تعيين
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
                  className="px-8 py-3"
            >
                  <i className="fas fa-paper-plane mr-2"></i>
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
              </div>
        </form>
          </div>
        </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="تم إرسال الطلب بنجاح"
        size="md"
      >
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-4xl text-green-500"></i>
          </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
            تم إرسال طلب المساعدة بنجاح
          </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
            تم استلام طلبك وسيتم مراجعته من قبل الفريق المختص. 
            سيتم إشعارك بالنتيجة في أقرب وقت ممكن.
          </p>
            <Button
              variant="primary"
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-3"
            >
              <i className="fas fa-check mr-2"></i>
              موافق
            </Button>
          </div>
        </Modal>
        </div>
    </PageTransition>
  );
};

export default RequestAssistance;