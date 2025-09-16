using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AssistanceManagementSystem.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        public int? BranchId { get; set; }

        public virtual Branch? Branch { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLogin { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
