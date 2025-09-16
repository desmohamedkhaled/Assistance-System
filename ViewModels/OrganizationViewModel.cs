using System.ComponentModel.DataAnnotations;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.ViewModels
{
    public class OrganizationViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "اسم المؤسسة مطلوب")]
        [StringLength(100, ErrorMessage = "اسم المؤسسة يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "اسم المؤسسة")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "نوع المؤسسة مطلوب")]
        [StringLength(30, ErrorMessage = "نوع المؤسسة يجب أن يكون أقل من 30 حرف")]
        [Display(Name = "نوع المؤسسة")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "العنوان مطلوب")]
        [StringLength(200, ErrorMessage = "العنوان يجب أن يكون أقل من 200 حرف")]
        [Display(Name = "العنوان")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "رقم الهاتف مطلوب")]
        [StringLength(20, ErrorMessage = "رقم الهاتف يجب أن يكون أقل من 20 رقم")]
        [Display(Name = "رقم الهاتف")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "رقم الحساب مطلوب")]
        [StringLength(30, ErrorMessage = "رقم الحساب يجب أن يكون أقل من 30 رقم")]
        [Display(Name = "رقم الحساب")]
        public string AccountNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "الشخص المسؤول مطلوب")]
        [StringLength(100, ErrorMessage = "اسم الشخص المسؤول يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "الشخص المسؤول")]
        public string ContactPerson { get; set; } = string.Empty;

        [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
        [EmailAddress(ErrorMessage = "البريد الإلكتروني غير صحيح")]
        [StringLength(100, ErrorMessage = "البريد الإلكتروني يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "البريد الإلكتروني")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "تاريخ الإنشاء")]
        public DateTime CreatedAt { get; set; }

        public int ProjectsCount { get; set; }

        // Dropdown options
        public List<string> TypeOptions { get; set; } = new List<string> 
        { 
            "خيرية", "طبية", "اجتماعية", "تعليمية", "تنموية" 
        };
    }

    public class OrganizationIndexViewModel
    {
        public List<OrganizationViewModel> Organizations { get; set; } = new List<OrganizationViewModel>();
        public string? SearchTerm { get; set; }
        public string? TypeFilter { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
