import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Beneficiary, Assistance, Organization, Project } from '@/types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

export const exportToPDF = (data: any[], filename: string, title: string, columns: any[]) => {
  try {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}`, 14, 30);
    
    // Prepare data for table
    const tableData = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        if (typeof value === 'number' && col.key.includes('amount')) {
          return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        }
        return value || '';
      })
    );
    
    // Add table
    doc.autoTable({
      head: [columns.map(col => col.label)],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        halign: 'right',
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { top: 40, right: 14, bottom: 14, left: 14 }
    });
    
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

export const exportBeneficiariesToExcel = (beneficiaries: Beneficiary[]) => {
  const data = beneficiaries.map(beneficiary => ({
    'الاسم الأول': beneficiary.firstName,
    'الاسم الثاني': beneficiary.secondName,
    'الاسم الثالث': beneficiary.thirdName,
    'الاسم الأخير': beneficiary.lastName,
    'رقم الهوية': beneficiary.nationalId,
    'الهاتف': beneficiary.phone,
    'العنوان': beneficiary.address,
    'الجنس': beneficiary.gender,
    'الدين': beneficiary.religion,
    'الحالة الاجتماعية': beneficiary.maritalStatus,
    'عدد أفراد الأسرة': beneficiary.familyMembers,
    'الدخل': beneficiary.income,
    'تاريخ التسجيل': beneficiary.createdAt
  }));
  
  return exportToExcel(data, 'المستفيدين', 'المستفيدين');
};

export const exportBeneficiariesToPDF = (beneficiaries: Beneficiary[]) => {
  const columns = [
    { key: 'firstName', label: 'الاسم الأول' },
    { key: 'secondName', label: 'الاسم الثاني' },
    { key: 'thirdName', label: 'الاسم الثالث' },
    { key: 'lastName', label: 'الاسم الأخير' },
    { key: 'nationalId', label: 'رقم الهوية' },
    { key: 'phone', label: 'الهاتف' },
    { key: 'address', label: 'العنوان' },
    { key: 'gender', label: 'الجنس' },
    { key: 'religion', label: 'الدين' },
    { key: 'maritalStatus', label: 'الحالة الاجتماعية' },
    { key: 'familyMembers', label: 'عدد أفراد الأسرة' },
    { key: 'income', label: 'الدخل' },
    { key: 'createdAt', label: 'تاريخ التسجيل' }
  ];
  
  return exportToPDF(beneficiaries, 'المستفيدين', 'تقرير المستفيدين', columns);
};

export const exportAssistancesToExcel = (assistances: Assistance[], beneficiaries: Beneficiary[]) => {
  const data = assistances.map(assistance => {
    const beneficiary = beneficiaries.find(b => b.id === assistance.beneficiaryId);
    return {
      'نوع المساعدة': assistance.type,
      'المبلغ': assistance.amount,
      'طريقة الدفع': assistance.paymentMethod,
      'الحالة': assistance.status,
      'التاريخ': assistance.date,
      'الملاحظات': assistance.notes,
      'اسم المستفيد': beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : 'غير محدد',
      'رقم هوية المستفيد': beneficiary?.nationalId || 'غير محدد'
    };
  });
  
  return exportToExcel(data, 'المساعدات', 'المساعدات');
};

export const exportAssistancesToPDF = (assistances: Assistance[], beneficiaries: Beneficiary[]) => {
  const data = assistances.map(assistance => {
    const beneficiary = beneficiaries.find(b => b.id === assistance.beneficiaryId);
    return {
      ...assistance,
      beneficiaryName: beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : 'غير محدد',
      beneficiaryNationalId: beneficiary?.nationalId || 'غير محدد'
    };
  });
  
  const columns = [
    { key: 'type', label: 'نوع المساعدة' },
    { key: 'amount', label: 'المبلغ' },
    { key: 'paymentMethod', label: 'طريقة الدفع' },
    { key: 'status', label: 'الحالة' },
    { key: 'date', label: 'التاريخ' },
    { key: 'beneficiaryName', label: 'اسم المستفيد' },
    { key: 'beneficiaryNationalId', label: 'رقم هوية المستفيد' },
    { key: 'notes', label: 'الملاحظات' }
  ];
  
  return exportToPDF(data, 'المساعدات', 'تقرير المساعدات', columns);
};

export const exportOrganizationsToExcel = (organizations: Organization[]) => {
  const data = organizations.map(org => ({
    'اسم المؤسسة': org.name,
    'نوع المؤسسة': org.type,
    'العنوان': org.address,
    'الهاتف': org.phone,
    'رقم الحساب': org.accountNumber,
    'الشخص المسؤول': org.contactPerson,
    'البريد الإلكتروني': org.email,
    'تاريخ التسجيل': org.createdAt
  }));
  
  return exportToExcel(data, 'المؤسسات', 'المؤسسات');
};

export const exportProjectsToExcel = (projects: Project[], organizations: Organization[]) => {
  const data = projects.map(project => {
    const organization = organizations.find(org => org.id === project.organizationId);
    return {
      'اسم المشروع': project.name,
      'نوع المشروع': project.type,
      'الحالة': project.status,
      'تاريخ البداية': project.startDate,
      'تاريخ النهاية': project.endDate,
      'الميزانية': project.budget,
      'الوصف': project.description,
      'المؤسسة': organization?.name || 'غير محدد',
      'تاريخ التسجيل': project.createdAt
    };
  });
  
  return exportToExcel(data, 'المشاريع', 'المشاريع');
};

export const generateDashboardReport = (data: {
  totalBeneficiaries: number;
  totalAssistances: number;
  totalOrganizations: number;
  totalProjects: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
  totalApprovedAmount: number;
  maleBeneficiaries: number;
  femaleBeneficiaries: number;
  averageAssistanceAmount: number;
}) => {
  try {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(24);
    doc.text('تقرير لوحة التحكم', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 14, 35);
    
    // Add statistics
    doc.setFontSize(16);
    doc.text('الإحصائيات العامة', 14, 55);
    
    const stats = [
      ['إجمالي المستفيدين', data.totalBeneficiaries.toString()],
      ['إجمالي المساعدات', data.totalAssistances.toString()],
      ['إجمالي المؤسسات', data.totalOrganizations.toString()],
      ['إجمالي المشاريع', data.totalProjects.toString()],
      ['المبلغ المدفوع', new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(data.totalPaidAmount)],
      ['المبلغ المعلق', new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(data.totalPendingAmount)],
      ['المبلغ المعتمد', new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(data.totalApprovedAmount)],
      ['المستفيدين الذكور', data.maleBeneficiaries.toString()],
      ['المستفيدين الإناث', data.femaleBeneficiaries.toString()],
      ['متوسط المساعدة', new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(data.averageAssistanceAmount)]
    ];
    
    doc.autoTable({
      head: [['المؤشر', 'القيمة']],
      body: stats,
      startY: 65,
      styles: {
        fontSize: 12,
        cellPadding: 5,
        halign: 'right',
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { top: 65, right: 14, bottom: 14, left: 14 }
    });
    
    doc.save('تقرير_لوحة_التحكم.pdf');
    return true;
  } catch (error) {
    console.error('Error generating dashboard report:', error);
    return false;
  }
};
