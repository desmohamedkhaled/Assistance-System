using System.ComponentModel.DataAnnotations;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.ViewModels
{
    public class ProjectViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "اسم المشروع مطلوب")]
        [StringLength(100, ErrorMessage = "اسم المشروع يجب أن يكون أقل من 100 حرف")]
        [Display(Name = "اسم المشروع")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "نوع المشروع مطلوب")]
        [StringLength(30, ErrorMessage = "نوع المشروع يجب أن يكون أقل من 30 حرف")]
        [Display(Name = "نوع المشروع")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "العنوان مطلوب")]
        [StringLength(200, ErrorMessage = "العنوان يجب أن يكون أقل من 200 حرف")]
        [Display(Name = "العنوان")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "رقم الهاتف مطلوب")]
        [StringLength(20, ErrorMessage = "رقم الهاتف يجب أن يكون أقل من 20 رقم")]
        [Display(Name = "رقم الهاتف")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "حالة المشروع مطلوبة")]
        [StringLength(20, ErrorMessage = "حالة المشروع يجب أن تكون أقل من 20 حرف")]
        [Display(Name = "حالة المشروع")]
        public string Status { get; set; } = "نشط";

        [Required(ErrorMessage = "تاريخ البداية مطلوب")]
        [Display(Name = "تاريخ البداية")]
        public DateTime StartDate { get; set; } = DateTime.Now;

        [Display(Name = "تاريخ النهاية")]
        public DateTime? EndDate { get; set; }

        [StringLength(500, ErrorMessage = "الوصف يجب أن يكون أقل من 500 حرف")]
        [Display(Name = "الوصف")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "المؤسسة مطلوبة")]
        [Display(Name = "المؤسسة")]
        public int OrganizationId { get; set; }

        public string? OrganizationName { get; set; }

        [Required(ErrorMessage = "الميزانية مطلوبة")]
        [Range(0.01, double.MaxValue, ErrorMessage = "الميزانية يجب أن تكون أكبر من صفر")]
        [Display(Name = "الميزانية")]
        public decimal Budget { get; set; }

        [Display(Name = "تاريخ الإنشاء")]
        public DateTime CreatedAt { get; set; }

        // Dropdown options
        public List<string> TypeOptions { get; set; } = new List<string> 
        { 
            "اجتماعي", "طبي", "تعليمي", "تنموي" 
        };
        public List<string> StatusOptions { get; set; } = new List<string> 
        { 
            "نشط", "قيد التنفيذ", "مكتمل", "معلق" 
        };
        public List<Organization> Organizations { get; set; } = new List<Organization>();
    }

    public class ProjectIndexViewModel
    {
        public List<ProjectViewModel> Projects { get; set; } = new List<ProjectViewModel>();
        public string? SearchTerm { get; set; }
        public string? TypeFilter { get; set; }
        public string? StatusFilter { get; set; }
        public int? OrganizationFilter { get; set; }
        public List<Organization> Organizations { get; set; } = new List<Organization>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
