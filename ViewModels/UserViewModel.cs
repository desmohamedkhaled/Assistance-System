using System.ComponentModel.DataAnnotations;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; } = string.Empty;

        [Required(ErrorMessage = "الاسم بالكامل مطلوب")]
        [StringLength(100, ErrorMessage = "الاسم بالكامل يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "الاسم بالكامل")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "اسم المستخدم مطلوب")]
        [StringLength(50, ErrorMessage = "اسم المستخدم يجب أن يكون أقل من 50 حرف")]
        [Display(Name = "اسم المستخدم")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
        [EmailAddress(ErrorMessage = "البريد الإلكتروني غير صحيح")]
        [StringLength(100, ErrorMessage = "البريد الإلكتروني يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "البريد الإلكتروني")]
        public string Email { get; set; } = string.Empty;

        [StringLength(15, ErrorMessage = "رقم الهاتف يجب أن يكون أقل من 15 رقم")]
        [Display(Name = "رقم الهاتف")]
        public string? PhoneNumber { get; set; }

        [Display(Name = "الفرع")]
        public int? BranchId { get; set; }

        public string? BranchName { get; set; }

        [Display(Name = "الدور")]
        public string Role { get; set; } = string.Empty;

        [Display(Name = "الحالة")]
        public bool IsActive { get; set; } = true;

        [Display(Name = "تاريخ الإنشاء")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "آخر تسجيل دخول")]
        public DateTime? LastLogin { get; set; }

        // Dropdown options
        public List<string> RoleOptions { get; set; } = new List<string> 
        { 
            "Admin", "Branch Manager", "Staff", "Approver", "Beneficiary" 
        };
        public List<Branch> Branches { get; set; } = new List<Branch>();
    }

    public class CreateUserViewModel
    {
        [Required(ErrorMessage = "الاسم بالكامل مطلوب")]
        [StringLength(100, ErrorMessage = "الاسم بالكامل يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "الاسم بالكامل")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
        [EmailAddress(ErrorMessage = "البريد الإلكتروني غير صحيح")]
        [StringLength(100, ErrorMessage = "البريد الإلكتروني يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "البريد الإلكتروني")]
        public string Email { get; set; } = string.Empty;

        [StringLength(15, ErrorMessage = "رقم الهاتف يجب أن يكون أقل من 15 رقم")]
        [Display(Name = "رقم الهاتف")]
        public string? PhoneNumber { get; set; }

        [Display(Name = "الفرع")]
        public int? BranchId { get; set; }

        [Required(ErrorMessage = "الدور مطلوب")]
        [Display(Name = "الدور")]
        public string Role { get; set; } = string.Empty;

        [Required(ErrorMessage = "كلمة المرور مطلوبة")]
        [StringLength(100, ErrorMessage = "كلمة المرور يجب أن تكون أقل من 100 حرف", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "كلمة المرور")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "تأكيد كلمة المرور مطلوب")]
        [DataType(DataType.Password)]
        [Display(Name = "تأكيد كلمة المرور")]
        [Compare("Password", ErrorMessage = "كلمة المرور وتأكيدها غير متطابقتين")]
        public string ConfirmPassword { get; set; } = string.Empty;

        // Dropdown options
        public List<string> RoleOptions { get; set; } = new List<string> 
        { 
            "Admin", "Branch Manager", "Staff", "Approver", "Beneficiary" 
        };
        public List<Branch> Branches { get; set; } = new List<Branch>();
    }

    public class EditUserViewModel
    {
        public string Id { get; set; } = string.Empty;

        [Required(ErrorMessage = "الاسم بالكامل مطلوب")]
        [StringLength(100, ErrorMessage = "الاسم بالكامل يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "الاسم بالكامل")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
        [EmailAddress(ErrorMessage = "البريد الإلكتروني غير صحيح")]
        [StringLength(100, ErrorMessage = "البريد الإلكتروني يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "البريد الإلكتروني")]
        public string Email { get; set; } = string.Empty;

        [StringLength(15, ErrorMessage = "رقم الهاتف يجب أن يكون أقل من 15 رقم")]
        [Display(Name = "رقم الهاتف")]
        public string? PhoneNumber { get; set; }

        [Display(Name = "الفرع")]
        public int? BranchId { get; set; }

        [Required(ErrorMessage = "الدور مطلوب")]
        [Display(Name = "الدور")]
        public string SelectedRole { get; set; } = string.Empty;

        [Display(Name = "الحالة")]
        public bool IsActive { get; set; } = true;

        // Dropdown options
        public List<string> RoleOptions { get; set; } = new List<string> 
        { 
            "Admin", "Branch Manager", "Staff", "Approver", "Beneficiary" 
        };
        public List<Branch> Branches { get; set; } = new List<Branch>();
    }

    public class UserIndexViewModel
    {
        public List<UserViewModel> Users { get; set; } = new List<UserViewModel>();
        public string? SearchTerm { get; set; }
        public string? RoleFilter { get; set; }
        public int? BranchFilter { get; set; }
        public List<Branch> Branches { get; set; } = new List<Branch>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
