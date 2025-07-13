using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{


    public class GroupMember
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("Group")]
        public Guid GroupId { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        public GroupRole Role { get; set; } = GroupRole.Member;

        [Required]
        public bool Notifications { get; set; } = true;

        // Навигационные свойства
        public  Group Group { get; set; }
        public  User User { get; set; }

    }
    public enum GroupRole
    {
        Owner,
        Member,
        Moderator
    }
}
