using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CosmoBack.Models
{
    public class Group
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("Owner")]
        [Required]
        public Guid OwnerId { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }

        [Required]
        public bool IsPublic { get; set; }

        [MaxLength(50)]
        public string? GroupTag { get; set; }

        public string? Description { get; set; }

        [ForeignKey("AvatarImage")]
        public Guid? AvatarImageId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public int MembersNumber { get; set; }

        // Навигационные свойства
        public Image? AvatarImage { get; set; }
        public User Owner { get; set; }
        //public ICollection<GroupMember> Members { get; set; }
        //public ICollection<Message> Messages { get; set; }
    }
}