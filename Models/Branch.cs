using System.ComponentModel.DataAnnotations;

namespace AssistanceManagementSystem.Models
{
    public class Branch
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        public string? ManagerId { get; set; }

        public virtual ApplicationUser? Manager { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
        public virtual ICollection<Beneficiary> Beneficiaries { get; set; } = new List<Beneficiary>();
    }
}
