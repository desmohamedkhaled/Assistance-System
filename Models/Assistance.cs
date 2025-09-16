using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssistanceManagementSystem.Models
{
    public class Assistance
    {
        public int Id { get; set; }

        [Required]
        public int BeneficiaryId { get; set; }

        public virtual Beneficiary Beneficiary { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // مالية، علاجية، تعليمية، طبية، أيتام، أرامل، ذوي الاحتياجات، أسر السجناء

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(30)]
        public string PaymentMethod { get; set; } = string.Empty; // نقدي، تحويل بنكي، شيك، حساب داخلي، فيزا

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "معلق"; // معلق، قيد المراجعة، معتمد، مدفوع، مرفوض

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(200)]
        public string? NationalIdImage { get; set; } // صورة بطاقة الرقم القومي

        [StringLength(200)]
        public string? SupportingDocument { get; set; } // مستند داعم

        [Required]
        public string CreatedByUserId { get; set; } = string.Empty;

        public virtual ApplicationUser CreatedByUser { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ApprovedAt { get; set; }

        public string? ApprovedByUserId { get; set; }

        public virtual ApplicationUser? ApprovedByUser { get; set; }

        public DateTime? PaidAt { get; set; }

        public string? PaidByUserId { get; set; }

        public virtual ApplicationUser? PaidByUser { get; set; }
    }
}
