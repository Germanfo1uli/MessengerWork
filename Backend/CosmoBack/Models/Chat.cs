using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CosmoBack.Models
{
    public class Chat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("FirstUser")]
        public Guid FirstUserId { get; set; }

        [Required]
        [ForeignKey("SecondUser")]
        public Guid SecondUserId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [NotMapped]
        public DateTime? LastMessageAt { get; set; } // возможно нельзя передать во frontend - чек

        // Навигационные свойства
        public User FirstUser { get; set; }
        public User SecondUser { get; set; }

        [NotMapped]
        public Message? LastMessage => Messages?.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
        public ICollection<Message>? Messages { get; set; }
    }
}