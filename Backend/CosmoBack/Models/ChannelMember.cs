using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class ChannelMember
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("Channel")]
        public int ChannelId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public bool Notifications { get; set; } = true;

        // Навигационные свойства
        public  Channel Channel { get; set; }
        public  User User { get; set; }

        
    }
}