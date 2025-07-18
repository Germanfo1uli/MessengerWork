using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("Chat")]
        public Guid? ChatId { get; set; }

        [ForeignKey("Group")]
        public Guid? GroupId { get; set; }

        [ForeignKey("Channel")]
        public Guid? ChannelId { get; set; }

        [Required]
        [ForeignKey("Sender")]
        public Guid SenderId { get; set; }

        [Column(TypeName = "text")]
        [MaxLength(5000)]
        public string? Comment { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public virtual Chat? Chat { get; set; }
        public virtual Group? Group { get; set; }
        public virtual Channel? Channel { get; set; }
        public virtual User? Sender { get; set; }
        public virtual ICollection<Media>? Media { get; set; }
        public virtual ICollection<Reaction>? Reactions { get; set; }
    }
}