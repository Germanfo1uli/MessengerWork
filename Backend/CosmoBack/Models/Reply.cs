using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Reply
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("OriginalMessage")]
        public Guid OriginalMessageId { get; set; }

        [ForeignKey("ReplyMessage")]
        public Guid ReplyMessageId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public virtual Message OriginalMessage { get; set; }
        public virtual Message ReplyMessage { get; set; }
    }
}