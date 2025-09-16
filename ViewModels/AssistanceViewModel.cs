using System.ComponentModel.DataAnnotations;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.ViewModels
{
    public class AssistanceViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "المستفيد مطلوب")]
        [Display(Name = "المستفيد")]
        public int BeneficiaryId { get; set; }

        public string? BeneficiaryName { get; set; }

        [Required(ErrorMessage = "نوع المساعدة مطلوب")]
        [Display(Name = "نوع المساعدة")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "المبلغ مطلوب")]
        [Range(0.01, double.MaxValue, ErrorMessage = "المبلغ يجب أن يكون أكبر من صفر")]
        [Display(Name = "المبلغ")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "طريقة الدفع مطلوبة")]
        [Display(Name = "طريقة الدفع")]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required(ErrorMessage = "الحالة مطلوبة")]
        [Display(Name = "الحالة")]
        public string Status { get; set; } = "معلق";

        [Display(Name = "التاريخ")]
        public DateTime Date { get; set; } = DateTime.Now;

        [StringLength(500, ErrorMessage = "الملاحظات يجب أن تكون أقل من 500 حرف")]
        [Display(Name = "الملاحظات")]
        public string? Notes { get; set; }

        [Display(Name = "صورة بطاقة الرقم القومي")]
        public string? NationalIdImage { get; set; }

        [Display(Name = "المستند الداعم")]
        public string? SupportingDocument { get; set; }

        public string CreatedByUserId { get; set; } = string.Empty;
        public string? CreatedByUserName { get; set; }

        [Display(Name = "تاريخ الإنشاء")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "تاريخ الموافقة")]
        public DateTime? ApprovedAt { get; set; }

        public string? ApprovedByUserId { get; set; }
        public string? ApprovedByUserName { get; set; }

        [Display(Name = "تاريخ الدفع")]
        public DateTime? PaidAt { get; set; }

        public string? PaidByUserId { get; set; }
        public string? PaidByUserName { get; set; }

        // Dropdown options
        public List<string> TypeOptions { get; set; } = new List<string> 
        { 
            "مالية", "علاجية", "تعليمية", "طبية", "أيتام", "أرامل", "ذوي الاحتياجات", "أسر السجناء" 
        };
        public List<string> PaymentMethodOptions { get; set; } = new List<string> 
        { 
            "نقدي", "تحويل بنكي", "شيك", "حساب داخلي", "فيزا" 
        };
        public List<string> StatusOptions { get; set; } = new List<string> 
        { 
            "معلق", "قيد المراجعة", "معتمد", "مدفوع", "مرفوض" 
        };
        public List<Beneficiary> Beneficiaries { get; set; } = new List<Beneficiary>();
    }

    public class AssistanceIndexViewModel
    {
        public List<AssistanceViewModel> Assistances { get; set; } = new List<AssistanceViewModel>();
        public string? SearchTerm { get; set; }
        public string? TypeFilter { get; set; }
        public string? StatusFilter { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? BranchFilter { get; set; }
        public List<Branch> Branches { get; set; } = new List<Branch>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

    public class RequestAssistanceViewModel
    {
        [Required(ErrorMessage = "الاسم بالكامل مطلوب")]
        [StringLength(100, ErrorMessage = "الاسم بالكامل يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "الاسم بالكامل")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "الرقم القومي مطلوب")]
        [StringLength(14, MinimumLength = 14, ErrorMessage = "الرقم القومي يجب أن يكون 14 رقم")]
        [Display(Name = "الرقم القومي")]
        public string NationalId { get; set; } = string.Empty;

        [Required(ErrorMessage = "رقم الهاتف مطلوب")]
        [StringLength(15, ErrorMessage = "رقم الهاتف يجب أن يكون أقل من 15 رقم")]
        [Display(Name = "رقم الهاتف")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "العنوان مطلوب")]
        [StringLength(200, ErrorMessage = "العنوان يجب أن يكون أقل من 200 حرف")]
        [Display(Name = "العنوان")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "النوع مطلوب")]
        [Display(Name = "النوع")]
        public string Gender { get; set; } = string.Empty;

        [Required(ErrorMessage = "الديانة مطلوبة")]
        [Display(Name = "الديانة")]
        public string Religion { get; set; } = string.Empty;

        [Required(ErrorMessage = "الحالة الاجتماعية مطلوبة")]
        [Display(Name = "الحالة الاجتماعية")]
        public string MaritalStatus { get; set; } = string.Empty;

        [Required(ErrorMessage = "عدد أفراد الأسرة مطلوب")]
        [Range(1, 20, ErrorMessage = "عدد أفراد الأسرة يجب أن يكون بين 1 و 20")]
        [Display(Name = "عدد أفراد الأسرة")]
        public int FamilyMembers { get; set; }

        [Required(ErrorMessage = "الدخل الشهري مطلوب")]
        [Range(0, double.MaxValue, ErrorMessage = "الدخل الشهري يجب أن يكون رقم موجب")]
        [Display(Name = "الدخل الشهري")]
        public decimal Income { get; set; }

        [Required(ErrorMessage = "نوع المساعدة مطلوب")]
        [Display(Name = "نوع المساعدة")]
        public string AssistanceType { get; set; } = string.Empty;

        [Required(ErrorMessage = "المبلغ مطلوب")]
        [Range(0.01, double.MaxValue, ErrorMessage = "المبلغ يجب أن يكون أكبر من صفر")]
        [Display(Name = "المبلغ المطلوب")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "طريقة الدفع مطلوبة")]
        [Display(Name = "طريقة الدفع")]
        public string PaymentMethod { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "الملاحظات يجب أن تكون أقل من 500 حرف")]
        [Display(Name = "الملاحظات")]
        public string? Notes { get; set; }

        // Dropdown options
        public List<string> GenderOptions { get; set; } = new List<string> { "ذكر", "أنثى" };
        public List<string> ReligionOptions { get; set; } = new List<string> { "مسلم", "مسلمة", "مسيحي", "مسيحية", "أخرى" };
        public List<string> MaritalStatusOptions { get; set; } = new List<string> { "عازب", "عزباء", "متزوج", "متزوجة", "مطلق", "مطلقة", "أرمل", "أرملة" };
        public List<string> TypeOptions { get; set; } = new List<string> 
        { 
            "مالية", "علاجية", "تعليمية", "طبية", "أيتام", "أرامل", "ذوي الاحتياجات", "أسر السجناء" 
        };
        public List<string> PaymentMethodOptions { get; set; } = new List<string> 
        { 
            "نقدي", "تحويل بنكي", "شيك", "حساب داخلي", "فيزا" 
        };
    }
}
