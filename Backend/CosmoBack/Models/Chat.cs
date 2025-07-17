using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Chat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public long PublicId { get; set; }

        [Required]
        [ForeignKey("FirstUser")]
        public Guid FirstUserId { get; set; }

        [Required]
        [ForeignKey("SecondUser")]
        public Guid SecondUserId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public User FirstUser { get; set; }
        public User SecondUser { get; set; }
        public ICollection<Message> Messages { get; set; }
        public List<ChatMember> Members { get; set; } = new();
    }
}