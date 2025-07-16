using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class PaymentMethod
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string StripePaymentMethodId { get; set; } = default!;

        [Required]
        [MaxLength(50)]
        public string StripeCustomerId { get; set; } = default!;

        [Required]
        public bool IsDefault { get; set; } = false;

        [Required]
        [MaxLength(4)]
        public string CardLast4 { get; set; } = default!;

        [Required]
        [MaxLength(20)]
        public string CardBrand { get; set; } = default!;

        [Required]
        public int ExpireYear { get; set; }

        [Required]
        public int ExpireMonth { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User User { get; set; } = default!;
    }
}