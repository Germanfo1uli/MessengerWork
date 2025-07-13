using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Reaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("Message")]
        public Guid MessageId { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Emoji { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public virtual Message Message { get; set; }
        public virtual User User { get; set; }
    }
}