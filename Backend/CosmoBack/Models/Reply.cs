using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Reply
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("OriginalMessage")]
        public Guid OriginalMessageId { get; set; }

        [Required]
        [ForeignKey("ReplyMessage")]
        public Guid ReplyMessageId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public Message OriginalMessage { get; set; }
        public Message ReplyMessage { get; set; }
    }
}