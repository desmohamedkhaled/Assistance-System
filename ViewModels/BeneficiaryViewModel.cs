using System.ComponentModel.DataAnnotations;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.ViewModels
{
    public class BeneficiaryViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "الاسم بالكامل مطلوب")]
        [StringLength(100, ErrorMessage = "الاسم بالكامل يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "الاسم بالكامل")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "الاسم الأول مطلوب")]
        [StringLength(50, ErrorMessage = "الاسم الأول يجب أن يكون أقل من 50 حرف")]
        [Display(Name = "الاسم الأول")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "الاسم الثاني مطلوب")]
        [StringLength(50, ErrorMessage = "الاسم الثاني يجب أن يكون أقل من 50 حرف")]
        [Display(Name = "الاسم الثاني")]
        public string SecondName { get; set; } = string.Empty;

        [Required(ErrorMessage = "الاسم الثالث مطلوب")]
        [StringLength(50, ErrorMessage = "الاسم الثالث يجب أن يكون أقل من 50 حرف")]
        [Display(Name = "الاسم الثالث")]
        public string ThirdName { get; set; } = string.Empty;

        [Required(ErrorMessage = "الاسم الأخير مطلوب")]
        [StringLength(50, ErrorMessage = "الاسم الأخير يجب أن يكون أقل من 50 حرف")]
        [Display(Name = "الاسم الأخير")]
        public string LastName { get; set; } = string.Empty;

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

        [Display(Name = "الفرع")]
        public int? BranchId { get; set; }

        public string? BranchName { get; set; }

        [Display(Name = "تاريخ الإنشاء")]
        public DateTime CreatedAt { get; set; }

        // Dropdown options
        public List<string> GenderOptions { get; set; } = new List<string> { "ذكر", "أنثى" };
        public List<string> ReligionOptions { get; set; } = new List<string> { "مسلم", "مسلمة", "مسيحي", "مسيحية", "أخرى" };
        public List<string> MaritalStatusOptions { get; set; } = new List<string> { "عازب", "عزباء", "متزوج", "متزوجة", "مطلق", "مطلقة", "أرمل", "أرملة" };
        public List<Branch> Branches { get; set; } = new List<Branch>();
    }

    public class BeneficiaryIndexViewModel
    {
        public List<BeneficiaryViewModel> Beneficiaries { get; set; } = new List<BeneficiaryViewModel>();
        public string? SearchTerm { get; set; }
        public string? GenderFilter { get; set; }
        public int? BranchFilter { get; set; }
        public List<Branch> Branches { get; set; } = new List<Branch>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
