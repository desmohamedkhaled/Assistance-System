import { Beneficiary, Organization, Project, Assistance, AidFile, User } from '@/types';

// Default Beneficiaries Data
export const defaultBeneficiaries: Beneficiary[] = [
  {
    id: 1,
    firstName: "فاطمة",
    secondName: "أحمد",
    thirdName: "محمد",
    lastName: "علي",
    nationalId: "12345678901234",
    phone: "01012345678",
    address: "القاهرة - حي مصر الجديدة",
    gender: "أنثى",
    religion: "مسلمة",
    maritalStatus: "أرملة",
    familyMembers: 4,
    income: 2500,
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    firstName: "محمد",
    secondName: "علي",
    thirdName: "حسن",
    lastName: "عبدالله",
    nationalId: "23456789012345",
    phone: "01023456789",
    address: "الإسكندرية - حي سيدي بشر",
    gender: "ذكر",
    religion: "مسلم",
    maritalStatus: "متزوج",
    familyMembers: 6,
    income: 4200,
    createdAt: "2024-01-02"
  },
  {
    id: 3,
    firstName: "سارة",
    secondName: "عبدالله",
    thirdName: "خالد",
    lastName: "سعد",
    nationalId: "34567890123456",
    phone: "01034567890",
    address: "الجيزة - حي الدقي",
    gender: "أنثى",
    religion: "مسلمة",
    maritalStatus: "عزباء",
    familyMembers: 2,
    income: 1800,
    createdAt: "2024-01-03"
  },
  {
    id: 4,
    firstName: "عبدالرحمن",
    secondName: "خالد",
    thirdName: "سعد",
    lastName: "محمد",
    nationalId: "45678901234567",
    phone: "01045678901",
    address: "القاهرة - حي المعادي",
    gender: "ذكر",
    religion: "مسلم",
    maritalStatus: "متزوج",
    familyMembers: 5,
    income: 3500,
    createdAt: "2024-01-04"
  },
  {
    id: 5,
    firstName: "نورا",
    secondName: "سعد",
    thirdName: "محمد",
    lastName: "علي",
    nationalId: "56789012345678",
    phone: "01056789012",
    address: "القاهرة - حي الزمالك",
    gender: "أنثى",
    religion: "مسلمة",
    maritalStatus: "مطلقة",
    familyMembers: 3,
    income: 2200,
    createdAt: "2024-01-05"
  },
  {
    id: 6,
    firstName: "أحمد",
    secondName: "محمد",
    thirdName: "علي",
    lastName: "حسن",
    nationalId: "67890123456789",
    phone: "01067890123",
    address: "القاهرة - حي شبرا",
    gender: "ذكر",
    religion: "مسلم",
    maritalStatus: "عازب",
    familyMembers: 1,
    income: 1500,
    createdAt: "2024-01-06"
  },
  {
    id: 7,
    firstName: "مريم",
    secondName: "عبدالرحمن",
    thirdName: "خالد",
    lastName: "سعد",
    nationalId: "78901234567890",
    phone: "01078901234",
    address: "الإسكندرية - حي المنتزه",
    gender: "أنثى",
    religion: "مسلمة",
    maritalStatus: "أرملة",
    familyMembers: 3,
    income: 2000,
    createdAt: "2024-01-07"
  },
  {
    id: 8,
    firstName: "يوسف",
    secondName: "أحمد",
    thirdName: "محمد",
    lastName: "علي",
    nationalId: "89012345678901",
    phone: "01089012345",
    address: "الجيزة - حي المهندسين",
    gender: "ذكر",
    religion: "مسلم",
    maritalStatus: "متزوج",
    familyMembers: 4,
    income: 3800,
    createdAt: "2024-01-08"
  }
];

// Default Organizations Data
export const defaultOrganizations: Organization[] = [
  {
    id: 1,
    name: "مؤسسة الخير للتنمية الاجتماعية",
    type: "خيرية",
    address: "القاهرة - حي مصر الجديدة",
    phone: "0223456789",
    accountNumber: "EG12345678901234567890",
    contactPerson: "أحمد محمد علي",
    email: "info@alkhair.org",
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "جمعية البر والإحسان",
    type: "خيرية",
    address: "الإسكندرية - حي سيدي بشر",
    phone: "0323456789",
    accountNumber: "EG23456789012345678901",
    contactPerson: "فاطمة أحمد محمد",
    email: "info@alber.org",
    createdAt: "2024-01-02"
  },
  {
    id: 3,
    name: "مؤسسة الأمل للرعاية الصحية",
    type: "طبية",
    address: "الجيزة - حي الدقي",
    phone: "0223456789",
    accountNumber: "EG34567890123456789012",
    contactPerson: "د. محمد علي حسن",
    email: "info@alamal-medical.org",
    createdAt: "2024-01-03"
  },
  {
    id: 4,
    name: "جمعية التكافل الاجتماعي",
    type: "اجتماعية",
    address: "القاهرة - حي المعادي",
    phone: "0223456789",
    accountNumber: "EG45678901234567890123",
    contactPerson: "سارة عبدالله خالد",
    email: "info@altakafol.org",
    createdAt: "2024-01-04"
  },
  {
    id: 5,
    name: "مؤسسة النور التعليمية",
    type: "تعليمية",
    address: "القاهرة - حي الزمالك",
    phone: "0223456789",
    accountNumber: "EG56789012345678901234",
    contactPerson: "عبدالرحمن خالد سعد",
    email: "info@alnour-edu.org",
    createdAt: "2024-01-05"
  }
];

// Default Projects Data
export const defaultProjects: Project[] = [
  {
    id: 1,
    name: "مشروع كفالة الأيتام",
    type: "اجتماعي",
    address: "القاهرة - حي مصر الجديدة",
    phone: "0223456789",
    status: "نشط",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    description: "مشروع شامل لكفالة الأيتام وتوفير الرعاية الكاملة لهم",
    organizationId: 1,
    budget: 500000,
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "مشروع الرعاية الصحية",
    type: "طبي",
    address: "الإسكندرية - حي سيدي بشر",
    phone: "0323456789",
    status: "نشط",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    description: "تقديم الرعاية الصحية المجانية للمحتاجين",
    organizationId: 3,
    budget: 750000,
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "مشروع التعليم للجميع",
    type: "تعليمي",
    address: "الجيزة - حي الدقي",
    phone: "0223456789",
    status: "قيد التنفيذ",
    startDate: "2024-02-01",
    endDate: "2024-11-30",
    description: "توفير التعليم المجاني للأطفال المحتاجين",
    organizationId: 5,
    budget: 300000,
    createdAt: "2024-02-01"
  },
  {
    id: 4,
    name: "مشروع دعم الأسر المحتاجة",
    type: "اجتماعي",
    address: "القاهرة - حي المعادي",
    phone: "0223456789",
    status: "مكتمل",
    startDate: "2023-12-01",
    endDate: "2024-01-31",
    description: "دعم مالي شهري للأسر المحتاجة",
    organizationId: 4,
    budget: 200000,
    createdAt: "2023-12-01"
  },
  {
    id: 5,
    name: "مشروع التدريب المهني",
    type: "تنموي",
    address: "القاهرة - حي الزمالك",
    phone: "0223456789",
    status: "نشط",
    startDate: "2024-01-20",
    endDate: "2024-10-20",
    description: "تدريب الشباب على المهن المختلفة لضمان فرص عمل",
    organizationId: 2,
    budget: 400000,
    createdAt: "2024-01-20"
  }
];

// Default Assistances Data
export const defaultAssistances: Assistance[] = [
  {
    id: 1,
    beneficiaryId: 1,
    type: "طبية",
    amount: 4500,
    paymentMethod: "تحويل بنكي",
    status: "مدفوع",
    date: "2024-01-18",
    notes: "علاج طبي عاجل لمرض الكلى - تم اعتماد الطلب بعد مراجعة الحالة الطبية"
  },
  {
    id: 2,
    beneficiaryId: 2,
    type: "أيتام",
    amount: 3000,
    paymentMethod: "نقدي",
    status: "معتمد",
    date: "2024-01-16",
    notes: "مساعدة مالية لرعاية الأيتام - تم اعتماد المبلغ المطلوب بالكامل"
  },
  {
    id: 3,
    beneficiaryId: 3,
    type: "تعليمية",
    amount: 3500,
    paymentMethod: "حساب داخلي",
    status: "معلق",
    date: "2024-01-13",
    notes: "رسوم دراسية للفصل الدراسي الجديد"
  },
  {
    id: 4,
    beneficiaryId: 4,
    type: "ذوي الاحتياجات",
    amount: 5500,
    paymentMethod: "فيزا",
    status: "مدفوع",
    date: "2024-01-15",
    notes: "شراء كرسي متحرك ومساعدات طبية - تم اعتماد الطلب مع تخفيض طفيف في المبلغ"
  },
  {
    id: 5,
    beneficiaryId: 5,
    type: "أرامل",
    amount: 2500,
    paymentMethod: "تحويل بنكي",
    status: "معتمد",
    date: "2024-01-13",
    notes: "مساعدة مالية شهرية للأرملة وأطفالها - تم اعتماد المبلغ المطلوب"
  },
  {
    id: 6,
    beneficiaryId: 6,
    type: "مالية",
    amount: 2000,
    paymentMethod: "نقدي",
    status: "مرفوض",
    date: "2024-01-10",
    notes: "مساعدة مالية عامة - تم رفض الطلب لعدم استيفاء الشروط"
  },
  {
    id: 7,
    beneficiaryId: 7,
    type: "طبية",
    amount: 3200,
    paymentMethod: "تحويل بنكي",
    status: "مدفوع",
    date: "2024-01-20",
    notes: "علاج طبي للأطفال - تم اعتماد الطلب"
  },
  {
    id: 8,
    beneficiaryId: 8,
    type: "تعليمية",
    amount: 1800,
    paymentMethod: "حساب داخلي",
    status: "معتمد",
    date: "2024-01-22",
    notes: "رسوم مدرسية للفصل الدراسي الثاني"
  }
];

// Default Aid Files Data
export const defaultAidFiles: AidFile[] = [
  {
    id: 1,
    fileName: "ملف المساعدات الطبية - يناير 2024",
    fileType: "طبية",
    totalAmount: 45000,
    totalBeneficiaries: 12,
    status: "مكتمل",
    createdDate: "2024-01-31",
    createdBy: "الإدارة",
    description: "ملف شامل لجميع المساعدات الطبية المقدمة في يناير 2024"
  },
  {
    id: 2,
    fileName: "ملف مساعدات الأيتام - يناير 2024",
    fileType: "أيتام",
    totalAmount: 30000,
    totalBeneficiaries: 8,
    status: "مكتمل",
    createdDate: "2024-01-31",
    createdBy: "الإدارة",
    description: "ملف شامل لجميع مساعدات الأيتام المقدمة في يناير 2024"
  },
  {
    id: 3,
    fileName: "ملف المساعدات التعليمية - فبراير 2024",
    fileType: "تعليمية",
    totalAmount: 25000,
    totalBeneficiaries: 15,
    status: "قيد الإعداد",
    createdDate: "2024-02-15",
    createdBy: "الإدارة",
    description: "ملف المساعدات التعليمية للفصل الدراسي الثاني"
  }
];

// Default Branches Data
export const defaultBranches = [
  // القاهرة وفروعها
  {
    id: 1,
    name: "القاهرة - المقطم",
    address: "المقطم، القاهرة",
    phone: "02-12345678",
    managerId: 2,
    status: "active",
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "القاهرة - الزيتون",
    address: "الزيتون، القاهرة",
    phone: "02-12345679",
    managerId: 3,
    status: "active",
    createdAt: "2024-01-02"
  },
  {
    id: 3,
    name: "القاهرة - السابع",
    address: "السابع، القاهرة",
    phone: "02-12345680",
    managerId: 4,
    status: "active",
    createdAt: "2024-01-03"
  },
  {
    id: 4,
    name: "القاهرة - اسماء فهمي",
    address: "اسماء فهمي (الحي)، القاهرة",
    phone: "02-12345681",
    managerId: 5,
    status: "active",
    createdAt: "2024-01-04"
  },
  {
    id: 5,
    name: "القاهرة - النصر",
    address: "النصر، القاهرة",
    phone: "02-12345682",
    managerId: 6,
    status: "active",
    createdAt: "2024-01-05"
  },
  {
    id: 6,
    name: "القاهرة - حلوان",
    address: "حلوان، القاهرة",
    phone: "02-12345683",
    managerId: 7,
    status: "active",
    createdAt: "2024-01-06"
  },
  {
    id: 7,
    name: "القاهرة - عين حلوان",
    address: "عين حلوان، القاهرة",
    phone: "02-12345684",
    managerId: 8,
    status: "active",
    createdAt: "2024-01-07"
  },
  
  // الإسكندرية وفروعها
  {
    id: 8,
    name: "الاسكندرية - السلطان حسين",
    address: "السلطان حسين، الإسكندرية",
    phone: "03-87654321",
    managerId: 9,
    status: "active",
    createdAt: "2024-01-08"
  },
  
  // الزقازيق وفروعها
  {
    id: 9,
    name: "الزقازيق - مشتول",
    address: "مشتول، الزقازيق",
    phone: "055-1234567",
    managerId: 10,
    status: "active",
    createdAt: "2024-01-09"
  },
  {
    id: 10,
    name: "الزقازيق - ميت العز",
    address: "ميت العز، الزقازيق",
    phone: "055-1234568",
    managerId: 11,
    status: "active",
    createdAt: "2024-01-10"
  },
  {
    id: 11,
    name: "الزقازيق - اولاد سيف",
    address: "اولاد سيف، الزقازيق",
    phone: "055-1234569",
    managerId: 12,
    status: "active",
    createdAt: "2024-01-11"
  },
  {
    id: 12,
    name: "الزقازيق - بلبيس",
    address: "بلبيس، الزقازيق",
    phone: "055-1234570",
    managerId: 13,
    status: "active",
    createdAt: "2024-01-12"
  },
  {
    id: 13,
    name: "الزقازيق - الزوامل",
    address: "الزوامل، الزقازيق",
    phone: "055-1234571",
    managerId: 14,
    status: "active",
    createdAt: "2024-01-13"
  },
  {
    id: 14,
    name: "الزقازيق - الديدامون",
    address: "الديدامون، الزقازيق",
    phone: "055-1234572",
    managerId: 15,
    status: "active",
    createdAt: "2024-01-14"
  },
  
  // أسيوط وفروعها
  {
    id: 15,
    name: "اسيوط - بني رافع",
    address: "بني رافع، أسيوط",
    phone: "088-1234567",
    managerId: 16,
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: 16,
    name: "اسيوط - الحواتكة",
    address: "الحواتكة، أسيوط",
    phone: "088-1234568",
    managerId: 17,
    status: "active",
    createdAt: "2024-01-16"
  },
  
  // طنطا وفروعها
  {
    id: 17,
    name: "طنطا - الفاتح",
    address: "الفاتح، طنطا",
    phone: "040-1234567",
    managerId: 18,
    status: "active",
    createdAt: "2024-01-17"
  },
  {
    id: 18,
    name: "طنطا - كفر الشرفا",
    address: "كفر الشرفا، طنطا",
    phone: "040-1234568",
    managerId: 19,
    status: "active",
    createdAt: "2024-01-18"
  },
  {
    id: 19,
    name: "طنطا - كفر الشيخ سليم",
    address: "كفر الشيخ سليم، طنطا",
    phone: "040-1234569",
    managerId: 20,
    status: "active",
    createdAt: "2024-01-19"
  },
  {
    id: 20,
    name: "طنطا - نشيل",
    address: "نشيل، طنطا",
    phone: "040-1234570",
    managerId: 21,
    status: "active",
    createdAt: "2024-01-20"
  },
  {
    id: 21,
    name: "طنطا - بتوفر",
    address: "بتوفر، طنطا",
    phone: "040-1234571",
    managerId: 22,
    status: "active",
    createdAt: "2024-01-21"
  },
  
  // شبرابيل وفروعها
  {
    id: 22,
    name: "شبرابيل - شبين الكوم",
    address: "شبين الكوم، شبرابيل",
    phone: "048-1234567",
    managerId: 23,
    status: "active",
    createdAt: "2024-01-22"
  },
  {
    id: 23,
    name: "شبرابيل - السادات",
    address: "السادات، شبرابيل",
    phone: "048-1234568",
    managerId: 24,
    status: "active",
    createdAt: "2024-01-23"
  },
  {
    id: 24,
    name: "شبرابيل - منشاه عصام",
    address: "منشاه عصام، شبرابيل",
    phone: "048-1234569",
    managerId: 25,
    status: "active",
    createdAt: "2024-01-24"
  },
  {
    id: 25,
    name: "شبرابيل - الباجور",
    address: "الباجور، شبرابيل",
    phone: "048-1234570",
    managerId: 26,
    status: "active",
    createdAt: "2024-01-25"
  },
  {
    id: 26,
    name: "شبرابيل - الخطاطبة",
    address: "الخطاطبة، شبرابيل",
    phone: "048-1234571",
    managerId: 27,
    status: "active",
    createdAt: "2024-01-26"
  },
  
  // الفروع المستقلة
  {
    id: 27,
    name: "الفيوم",
    address: "الفيوم",
    phone: "084-1234567",
    managerId: 28,
    status: "active",
    createdAt: "2024-01-27"
  },
  {
    id: 28,
    name: "بني سويف",
    address: "بني سويف",
    phone: "082-1234567",
    managerId: 29,
    status: "active",
    createdAt: "2024-01-28"
  },
  {
    id: 29,
    name: "بورسعيد",
    address: "بورسعيد",
    phone: "066-1234567",
    managerId: 30,
    status: "active",
    createdAt: "2024-01-29"
  },
  {
    id: 30,
    name: "السويس",
    address: "السويس",
    phone: "062-1234567",
    managerId: 31,
    status: "active",
    createdAt: "2024-01-30"
  },
  {
    id: 31,
    name: "العريش",
    address: "العريش",
    phone: "068-1234567",
    managerId: 32,
    status: "active",
    createdAt: "2024-01-31"
  },
  {
    id: 32,
    name: "طور سيناء",
    address: "طور سيناء",
    phone: "069-1234567",
    managerId: 33,
    status: "active",
    createdAt: "2024-02-01"
  },
  {
    id: 33,
    name: "الاسماعيليه - التل الكبير",
    address: "التل الكبير، الإسماعيلية",
    phone: "064-1234567",
    managerId: 34,
    status: "active",
    createdAt: "2024-02-02"
  },
  {
    id: 34,
    name: "الوادي الجديد",
    address: "الوادي الجديد",
    phone: "092-1234567",
    managerId: 35,
    status: "active",
    createdAt: "2024-02-03"
  },
  {
    id: 35,
    name: "دمنهور - بدر",
    address: "بدر، دمنهور",
    phone: "045-1234567",
    managerId: 36,
    status: "active",
    createdAt: "2024-02-04"
  },
  {
    id: 36,
    name: "فنا - قوص",
    address: "قوص، فنا",
    phone: "096-1234567",
    managerId: 37,
    status: "active",
    createdAt: "2024-02-05"
  },
  
  // المنيا وفروعها
  {
    id: 37,
    name: "المنيا - بني محمد سلطان",
    address: "بني محمد سلطان، المنيا",
    phone: "086-1234567",
    managerId: 38,
    status: "active",
    createdAt: "2024-02-06"
  },
  {
    id: 38,
    name: "المنيا - المغالقه",
    address: "المغالقه، المنيا",
    phone: "086-1234568",
    managerId: 39,
    status: "active",
    createdAt: "2024-02-07"
  },
  {
    id: 39,
    name: "المنيا - مغاغه",
    address: "مغاغه، المنيا",
    phone: "086-1234569",
    managerId: 40,
    status: "active",
    createdAt: "2024-02-08"
  },
  {
    id: 40,
    name: "المنيا - دير مواس",
    address: "دير مواس، المنيا",
    phone: "086-1234570",
    managerId: 41,
    status: "active",
    createdAt: "2024-02-09"
  },
  {
    id: 41,
    name: "المنيا - ابو عزيز",
    address: "ابو عزيز، المنيا",
    phone: "086-1234571",
    managerId: 42,
    status: "active",
    createdAt: "2024-02-10"
  },
  
  // أسوان وفروعها
  {
    id: 42,
    name: "اسوان - ادفو",
    address: "ادفو، أسوان",
    phone: "097-1234567",
    managerId: 43,
    status: "active",
    createdAt: "2024-02-11"
  },
  {
    id: 43,
    name: "اسوان - البصيليه",
    address: "البصيليه، أسوان",
    phone: "097-1234568",
    managerId: 44,
    status: "active",
    createdAt: "2024-02-12"
  },
  {
    id: 44,
    name: "اسوان - سلوا بحرى",
    address: "سلوا بحرى، أسوان",
    phone: "097-1234569",
    managerId: 45,
    status: "active",
    createdAt: "2024-02-13"
  },
  
  // المنصورة وفروعها
  {
    id: 45,
    name: "المنصوره - برج النور",
    address: "برج النور، المنصورة",
    phone: "050-1234567",
    managerId: 46,
    status: "active",
    createdAt: "2024-02-14"
  },
  {
    id: 46,
    name: "المنصوره - دماص",
    address: "دماص، المنصورة",
    phone: "050-1234568",
    managerId: 47,
    status: "active",
    createdAt: "2024-02-15"
  },
  {
    id: 47,
    name: "المنصوره - ديو الوسطى",
    address: "ديو الوسطى، المنصورة",
    phone: "050-1234569",
    managerId: 48,
    status: "active",
    createdAt: "2024-02-16"
  },
  {
    id: 48,
    name: "المنصوره - ابو داود السباخ",
    address: "ابو داود السباخ، المنصورة",
    phone: "050-1234570",
    managerId: 49,
    status: "active",
    createdAt: "2024-02-17"
  },
  {
    id: 49,
    name: "المنصوره - ميت تمامه",
    address: "ميت تمامه، المنصورة",
    phone: "050-1234571",
    managerId: 50,
    status: "active",
    createdAt: "2024-02-18"
  },
  {
    id: 50,
    name: "المنصوره - الجير",
    address: "الجير، المنصورة",
    phone: "050-1234572",
    managerId: 51,
    status: "active",
    createdAt: "2024-02-19"
  },
  {
    id: 51,
    name: "المنصوره - كفر علام",
    address: "كفر علام، المنصورة",
    phone: "050-1234573",
    managerId: 52,
    status: "active",
    createdAt: "2024-02-20"
  },
  {
    id: 52,
    name: "المنصوره - بلقاس",
    address: "بلقاس، المنصورة",
    phone: "050-1234574",
    managerId: 53,
    status: "active",
    createdAt: "2024-02-21"
  },
  
  // المحلة الكبرى وفروعها
  {
    id: 53,
    name: "المحلة الكبرى - المعتمدية",
    address: "المعتمدية، المحلة الكبرى",
    phone: "040-1234567",
    managerId: 54,
    status: "active",
    createdAt: "2024-02-22"
  },
  {
    id: 54,
    name: "المحلة الكبرى - محله زياد",
    address: "محله زياد، المحلة الكبرى",
    phone: "040-1234568",
    managerId: 55,
    status: "active",
    createdAt: "2024-02-23"
  },
  {
    id: 55,
    name: "المحلة الكبرى - ميت عساس",
    address: "ميت عساس، المحلة الكبرى",
    phone: "040-1234569",
    managerId: 56,
    status: "active",
    createdAt: "2024-02-24"
  },
  {
    id: 56,
    name: "المحلة الكبرى - بشبيش",
    address: "بشبيش، المحلة الكبرى",
    phone: "040-1234570",
    managerId: 57,
    status: "active",
    createdAt: "2024-02-25"
  },
  {
    id: 57,
    name: "المحلة الكبرى - السجاعية",
    address: "السجاعية، المحلة الكبرى",
    phone: "040-1234571",
    managerId: 58,
    status: "active",
    createdAt: "2024-02-26"
  },
  
  // ميت هاشم وفروعها
  {
    id: 58,
    name: "ميت هاشم - صفط تراب",
    address: "صفط تراب، ميت هاشم",
    phone: "040-1234572",
    managerId: 59,
    status: "active",
    createdAt: "2024-02-27"
  },
  
  // سوهاج وفروعها
  {
    id: 59,
    name: "سوهاج - شندويل",
    address: "شندويل، سوهاج",
    phone: "093-1234567",
    managerId: 60,
    status: "active",
    createdAt: "2024-02-28"
  },
  {
    id: 60,
    name: "سوهاج - جزیره شندويل",
    address: "جزیره شندويل، سوهاج",
    phone: "093-1234568",
    managerId: 61,
    status: "active",
    createdAt: "2024-03-01"
  },
  {
    id: 61,
    name: "سوهاج - طهطا",
    address: "طهطا، سوهاج",
    phone: "093-1234569",
    managerId: 62,
    status: "active",
    createdAt: "2024-03-02"
  },
  
  // دمياط وفروعها
  {
    id: 62,
    name: "دمياط - الرحامته",
    address: "الرحامته، دمياط",
    phone: "057-1234567",
    managerId: 63,
    status: "active",
    createdAt: "2024-03-03"
  },
  {
    id: 63,
    name: "دمياط - الزرقا",
    address: "الزرقا، دمياط",
    phone: "057-1234568",
    managerId: 64,
    status: "active",
    createdAt: "2024-03-04"
  },
  
  // بنها وفروعها
  {
    id: 64,
    name: "بنها - شبرا الخيمه",
    address: "شبرا الخيمه، بنها",
    phone: "013-1234567",
    managerId: 65,
    status: "active",
    createdAt: "2024-03-05"
  },
  
  // كفر الشيخ وفروعها
  {
    id: 65,
    name: "كفر الشيخ - الخادمية",
    address: "الخادمية، كفر الشيخ",
    phone: "047-1234567",
    managerId: 66,
    status: "active",
    createdAt: "2024-03-06"
  },
  
  // الجيزة وفروعها
  {
    id: 66,
    name: "الجيزة - المهندسين",
    address: "المهندسين، الجيزة",
    phone: "02-12345685",
    managerId: 67,
    status: "active",
    createdAt: "2024-03-07"
  },
  {
    id: 67,
    name: "الجيزة - اكتوبر",
    address: "اكتوبر، الجيزة",
    phone: "02-12345686",
    managerId: 68,
    status: "active",
    createdAt: "2024-03-08"
  },
  
  // الأقصر وفروعها
  {
    id: 68,
    name: "الاقصر - المحاميد",
    address: "المحاميد، الأقصر",
    phone: "095-1234567",
    managerId: 69,
    status: "active",
    createdAt: "2024-03-09"
  },
  
  // سفاجا وفروعها
  {
    id: 69,
    name: "سفاجا - شلاتين",
    address: "شلاتين، سفاجا",
    phone: "065-1234567",
    managerId: 70,
    status: "active",
    createdAt: "2024-03-10"
  },
  
  // الداخلة وفروعها
  {
    id: 70,
    name: "الداخله - كوم امبو",
    address: "كوم امبو، الداخلة",
    phone: "097-1234570",
    managerId: 71,
    status: "active",
    createdAt: "2024-03-11"
  }
];

// Default Users Data
export const defaultUsers: User[] = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    fullName: "مدير النظام العام",
    email: "admin@ams.org",
    phone: "01000000000",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
    permissions: ["all"]
  },
  // مديري الفروع الرئيسية
  {
    id: 2,
    username: "manager_cairo_mokattam",
    password: "manager123",
    fullName: "أحمد محمد - مدير فرع المقطم",
    email: "cairo.mokattam@ams.org",
    phone: "01000000001",
    role: "branch_manager",
    status: "active",
    branchId: 1,
    createdAt: "2024-01-02",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 3,
    username: "manager_cairo_zeitoun",
    password: "manager123",
    fullName: "فاطمة أحمد - مدير فرع الزيتون",
    email: "cairo.zeitoun@ams.org",
    phone: "01000000002",
    role: "branch_manager",
    status: "active",
    branchId: 2,
    createdAt: "2024-01-03",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 4,
    username: "manager_cairo_seventh",
    password: "manager123",
    fullName: "محمد علي - مدير فرع السابع",
    email: "cairo.seventh@ams.org",
    phone: "01000000003",
    role: "branch_manager",
    status: "active",
    branchId: 3,
    createdAt: "2024-01-04",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 5,
    username: "manager_cairo_asmaa",
    password: "manager123",
    fullName: "سارة محمود - مدير فرع اسماء فهمي",
    email: "cairo.asmaa@ams.org",
    phone: "01000000004",
    role: "branch_manager",
    status: "active",
    branchId: 4,
    createdAt: "2024-01-05",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 6,
    username: "manager_cairo_nasr",
    password: "manager123",
    fullName: "علي حسن - مدير فرع النصر",
    email: "cairo.nasr@ams.org",
    phone: "01000000005",
    role: "branch_manager",
    status: "active",
    branchId: 5,
    createdAt: "2024-01-06",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 7,
    username: "manager_cairo_helwan",
    password: "manager123",
    fullName: "نور الدين أحمد - مدير فرع حلوان",
    email: "cairo.helwan@ams.org",
    phone: "01000000006",
    role: "branch_manager",
    status: "active",
    branchId: 6,
    createdAt: "2024-01-07",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 8,
    username: "manager_cairo_ain_helwan",
    password: "manager123",
    fullName: "مريم سعد - مدير فرع عين حلوان",
    email: "cairo.ain.helwan@ams.org",
    phone: "01000000007",
    role: "branch_manager",
    status: "active",
    branchId: 7,
    createdAt: "2024-01-08",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 9,
    username: "manager_alex_sultan",
    password: "manager123",
    fullName: "خالد إبراهيم - مدير فرع السلطان حسين",
    email: "alex.sultan@ams.org",
    phone: "01000000008",
    role: "branch_manager",
    status: "active",
    branchId: 8,
    createdAt: "2024-01-09",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  {
    id: 10,
    username: "manager_zagazig_mashtoul",
    password: "manager123",
    fullName: "منى سعد - مدير فرع مشتول",
    email: "zagazig.mashtoul@ams.org",
    phone: "01000000009",
    role: "branch_manager",
    status: "active",
    branchId: 9,
    createdAt: "2024-01-10",
    permissions: ["view_branch_data", "manage_branch_beneficiaries", "manage_branch_assistances", "approve_requests", "view_branch_reports"]
  },
  
  // موظفي إدخال البيانات
  {
    id: 11,
    username: "staff_cairo_1",
    password: "staff123",
    fullName: "سارة محمود - موظف إدخال بيانات",
    email: "cairo.staff1@ams.org",
    phone: "01000000010",
    role: "staff",
    status: "active",
    branchId: 1,
    createdAt: "2024-01-11",
    permissions: ["add_beneficiaries", "add_assistances", "edit_own_data", "view_dashboard"]
  },
  {
    id: 12,
    username: "staff_cairo_2",
    password: "staff123",
    fullName: "علي حسن - موظف إدخال بيانات",
    email: "cairo.staff2@ams.org",
    phone: "01000000011",
    role: "staff",
    status: "active",
    branchId: 2,
    createdAt: "2024-01-12",
    permissions: ["add_beneficiaries", "add_assistances", "edit_own_data", "view_dashboard"]
  },
  {
    id: 13,
    username: "staff_alex_1",
    password: "staff123",
    fullName: "فاطمة أحمد - موظف إدخال بيانات",
    email: "alex.staff1@ams.org",
    phone: "01000000012",
    role: "staff",
    status: "active",
    branchId: 8,
    createdAt: "2024-01-13",
    permissions: ["add_beneficiaries", "add_assistances", "edit_own_data", "view_dashboard"]
  },
  {
    id: 14,
    username: "staff_zagazig_1",
    password: "staff123",
    fullName: "محمد علي - موظف إدخال بيانات",
    email: "zagazig.staff1@ams.org",
    phone: "01000000013",
    role: "staff",
    status: "active",
    branchId: 9,
    createdAt: "2024-01-14",
    permissions: ["add_beneficiaries", "add_assistances", "edit_own_data", "view_dashboard"]
  },
  
  // لجنة الموافقات
  {
    id: 15,
    username: "approver_1",
    password: "approver123",
    fullName: "د. خالد إبراهيم - لجنة الموافقات",
    email: "approver1@ams.org",
    phone: "01000000014",
    role: "approver",
    status: "active",
    createdAt: "2024-01-15",
    permissions: ["view_all_assistances", "approve_assistances", "reject_assistances", "mark_paid"]
  },
  {
    id: 16,
    username: "approver_2",
    password: "approver123",
    fullName: "د. منى سعد - لجنة الموافقات",
    email: "approver2@ams.org",
    phone: "01000000015",
    role: "approver",
    status: "active",
    createdAt: "2024-01-16",
    permissions: ["view_all_assistances", "approve_assistances", "reject_assistances", "mark_paid"]
  },
  {
    id: 17,
    username: "approver_3",
    password: "approver123",
    fullName: "د. أحمد محمود - لجنة الموافقات",
    email: "approver3@ams.org",
    phone: "01000000016",
    role: "approver",
    status: "active",
    createdAt: "2024-01-17",
    permissions: ["view_all_assistances", "approve_assistances", "reject_assistances", "mark_paid"]
  },
  
  // المستفيدين
  {
    id: 18,
    username: "beneficiary_001",
    password: "ben123",
    fullName: "أميرة محمد أحمد",
    email: "amira@ams.org",
    phone: "01000000017",
    role: "beneficiary",
    status: "active",
    createdAt: "2024-01-18",
    permissions: ["view_own_requests", "check_request_status"]
  },
  {
    id: 19,
    username: "beneficiary_002",
    password: "ben123",
    fullName: "محمد عبدالله السيد",
    email: "mohamed@ams.org",
    phone: "01000000018",
    role: "beneficiary",
    status: "active",
    createdAt: "2024-01-19",
    permissions: ["view_own_requests", "check_request_status"]
  },
  {
    id: 20,
    username: "beneficiary_003",
    password: "ben123",
    fullName: "فاطمة حسن علي",
    email: "fatma@ams.org",
    phone: "01000000019",
    role: "beneficiary",
    status: "active",
    createdAt: "2024-01-20",
    permissions: ["view_own_requests", "check_request_status"]
  },
  {
    id: 21,
    username: "beneficiary_004",
    password: "ben123",
    fullName: "عبدالرحمن محمود",
    email: "abdelrahman@ams.org",
    phone: "01000000020",
    role: "beneficiary",
    status: "active",
    createdAt: "2024-01-21",
    permissions: ["view_own_requests", "check_request_status"]
  }
];

