using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CosmoBack.Models
{
    public class Chat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("FirstUser")]
        [Required]
        public Guid FirstUserId { get; set; }

        [ForeignKey("SecondUser")]
        [Required]
        public Guid SecondUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("LastMessage")]
        public Guid? LastMessageId { get; set; }

        public DateTime? LastMessageAt { get; set; }

        // Навигационные свойства
        public User FirstUser { get; set; }
        public User SecondUser { get; set; }
        public Message? LastMessage { get; set; }
        public ICollection<Message>? Messages { get; set; }
    }
}