using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssistanceManagementSystem.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string Type { get; set; } = string.Empty; // اجتماعي، طبي، تعليمي، تنموي

        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "نشط"; // نشط، قيد التنفيذ، مكتمل، معلق

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public int OrganizationId { get; set; }

        public virtual Organization Organization { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Budget { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
