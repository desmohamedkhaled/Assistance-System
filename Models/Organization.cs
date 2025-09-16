using System.ComponentModel.DataAnnotations;

namespace AssistanceManagementSystem.Models
{
    public class Organization
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string Type { get; set; } = string.Empty; // خيرية، طبية، اجتماعية، تعليمية، تنموية

        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string ContactPerson { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
