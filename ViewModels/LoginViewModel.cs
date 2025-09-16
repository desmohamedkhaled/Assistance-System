using System.ComponentModel.DataAnnotations;

namespace AssistanceManagementSystem.ViewModels
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "اسم المستخدم أو البريد الإلكتروني مطلوب")]
        [Display(Name = "اسم المستخدم أو البريد الإلكتروني")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "كلمة المرور مطلوبة")]
        [DataType(DataType.Password)]
        [Display(Name = "كلمة المرور")]
        public string Password { get; set; } = string.Empty;

        [Display(Name = "تذكرني")]
        public bool RememberMe { get; set; }

        public string? ReturnUrl { get; set; }
    }
}
