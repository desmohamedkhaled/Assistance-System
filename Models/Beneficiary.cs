using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssistanceManagementSystem.Models
{
    public class Beneficiary
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string SecondName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ThirdName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(14)]
        public string NationalId { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string Gender { get; set; } = string.Empty; // ذكر، أنثى

        [Required]
        [StringLength(20)]
        public string Religion { get; set; } = string.Empty; // مسلم، مسلمة، مسيحي، مسيحية، أخرى

        [Required]
        [StringLength(20)]
        public string MaritalStatus { get; set; } = string.Empty; // عازب، عزباء، متزوج، متزوجة، مطلق، مطلقة، أرمل، أرملة

        public int FamilyMembers { get; set; }

        public decimal Income { get; set; }

        public int? BranchId { get; set; }

        public virtual Branch? Branch { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<Assistance> Assistances { get; set; } = new List<Assistance>();
    }
}
