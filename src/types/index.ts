// Core data types for the Assistance Management System

export interface Beneficiary {
  id: number;
  fullName: string; // الاسم بالكامل
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  nationalId: string; // الرقم القومي - مفتاح أساسي
  phone: string; // رقم الهاتف
  address: string;
  gender: 'ذكر' | 'أنثى'; // النوع
  religion: 'مسلم' | 'مسلمة' | 'مسيحي' | 'مسيحية' | 'أخرى'; // الديانة
  maritalStatus: 'عازب' | 'عزباء' | 'متزوج' | 'متزوجة' | 'مطلق' | 'مطلقة' | 'أرمل' | 'أرملة'; // الحالة الاجتماعية
  familyMembers: number; // عدد أفراد الأسرة
  income: number; // الدخل الشهري
  createdAt: string;
}

export interface Organization {
  id: number;
  name: string;
  type: 'خيرية' | 'طبية' | 'اجتماعية' | 'تعليمية' | 'تنموية';
  address: string;
  phone: string;
  accountNumber: string;
  contactPerson: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  type: 'اجتماعي' | 'طبي' | 'تعليمي' | 'تنموي';
  address: string;
  phone: string;
  status: 'نشط' | 'قيد التنفيذ' | 'مكتمل' | 'معلق';
  startDate: string;
  endDate: string;
  description: string;
  organizationId: number;
  budget: number;
  createdAt: string;
}

export interface Assistance {
  id: number;
  beneficiaryId: number;
  type: 'مالية' | 'علاجية' | 'تعليمية' | 'طبية' | 'أيتام' | 'أرامل' | 'ذوي الاحتياجات' | 'أسر السجناء'; // نوع المساعدة
  amount: number; // المبلغ المطلوب
  paymentMethod: 'نقدي' | 'تحويل بنكي' | 'شيك' | 'حساب داخلي' | 'فيزا'; // طريقة الصرف
  status: 'معلق' | 'قيد المراجعة' | 'معتمد' | 'مدفوع' | 'مرفوض';
  date: string;
  notes: string; // ملاحظات إضافية
  // المرفقات
  nationalIdImage?: string; // صورة بطاقة الرقم القومي
  supportingDocument?: string; // مستند داعم
}

export interface AidFile {
  id: number;
  fileName: string;
  fileType: string;
  totalAmount: number;
  totalBeneficiaries: number;
  status: 'مكتمل' | 'قيد الإعداد' | 'معلق';
  createdDate: string;
  createdBy: string;
  description: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'branch_manager' | 'staff' | 'approver' | 'beneficiary';
  status: 'active' | 'inactive' | 'suspended';
  branchId?: number; // للفرع (للمدير والموظفين)
  permissions?: string[]; // صلاحيات إضافية
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  managerId: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AppData {
  beneficiaries: Beneficiary[];
  assistances: Assistance[];
  organizations: Organization[];
  projects: Project[];
  aidFiles: AidFile[];
  users: User[];
  branches: Branch[];
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AppContextType {
  data: AppData;
  loading: boolean;
  error: string | null;
  // Beneficiary operations
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'createdAt'>) => Promise<Beneficiary>;
  updateBeneficiary: (id: number, beneficiary: Partial<Beneficiary>) => Promise<Beneficiary | null>;
  deleteBeneficiary: (id: number) => Promise<boolean>;
  getBeneficiaryById: (id: number) => Beneficiary | undefined;
  getBeneficiaryByNationalId: (nationalId: string) => Beneficiary | undefined;
  // Assistance operations
  addAssistance: (assistance: Omit<Assistance, 'id' | 'date'>) => Promise<Assistance>;
  updateAssistance: (id: number, assistance: Partial<Assistance>) => Promise<Assistance | null>;
  deleteAssistance: (id: number) => Promise<boolean>;
  getAssistanceById: (id: number) => Assistance | undefined;
  getAssistancesByBeneficiary: (beneficiaryId: number) => Assistance[];
  getAssistancesByStatus: (status: Assistance['status']) => Assistance[];
  getAssistancesByType: (type: Assistance['type']) => Assistance[];
  // Statistics
  getTotalBeneficiaries: () => number;
  getTotalAssistances: () => number;
  getTotalOrganizations: () => number;
  getTotalProjects: () => number;
  getTotalPaidAmount: () => number;
  getTotalPendingAmount: () => number;
  getTotalApprovedAmount: () => number;
  getMaleBeneficiaries: () => number;
  getFemaleBeneficiaries: () => number;
  getAverageAssistanceAmount: () => number;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel';
  filename?: string;
  includeCharts?: boolean;
}

