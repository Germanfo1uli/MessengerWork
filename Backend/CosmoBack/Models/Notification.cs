using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [ForeignKey("Chat")]
        public Guid? ChatId { get; set; }

        [ForeignKey("Group")]
        public Guid? GroupId { get; set; }

        [ForeignKey("Channel")]
        public Guid? ChannelId { get; set; }

        [Required]
        public bool IsEnabled { get; set; } = true;

        // Навигационные свойства
        public User User { get; set; } = default!;
        public Chat? Chat { get; set; }
        public Group? Group { get; set; }
        public Channel? Channel { get; set; }  
    }
}