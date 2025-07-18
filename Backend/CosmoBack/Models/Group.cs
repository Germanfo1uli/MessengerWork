using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Group
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public long PublicId { get; set; }

        [Required]
        [ForeignKey("Owner")]
        public Guid OwnerId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = default!;

        [Required]
        public bool IsPublic { get; set; }

        [MaxLength(50)]
        public string? GroupTag { get; set; }

        public string? Description { get; set; }

        [ForeignKey("AvatarImage")]
        public Guid? AvatarImageId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        [NotMapped]
        public Message? LastMessage => Messages?.OrderByDescending(m => m.CreatedAt).FirstOrDefault();

        [NotMapped]
        public DateTime? LastMessageAt => LastMessage?.CreatedAt;

        // Навигационные свойства
        public Image? AvatarImage { get; set; }
        public User Owner { get; set; }
        public ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
        public ICollection<Message>? Messages { get; set; }
    }
}