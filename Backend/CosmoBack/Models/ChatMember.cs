
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class ChatMember
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("Chat")]
        public Guid ChatId { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        public bool Notifications { get; set; } = true;

        // Навигационные свойства
        public  Chat Chat { get; set; }
        public  User User { get; set; }

        
    }
}