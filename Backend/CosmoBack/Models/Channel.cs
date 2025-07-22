using CosmoBack.Models.Dtos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Channel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("Owner")]
        public Guid OwnerId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = default!;

        [Required]
        public long PublicId { get; set; }

        public string? Description { get; set; }

        [ForeignKey("Avatar")]
        public Guid? AvatarImageId { get; set; }

        [NotMapped]
        public ImageDto? AvatarImage { get; set; } 

        [MaxLength(50)]
        public string? ChannelTag { get; set; }

        [Required]
        public bool IsPublic { get; set; } = false;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public bool IsActive { get; set; } = true;

        [Required]
        public int MembersNumber { get; set; } = 1;

        [NotMapped]
        public Message? LastMessage => Messages?.OrderByDescending(m => m.CreatedAt).FirstOrDefault();

        [NotMapped]
        public DateTime? LastMessageAt => LastMessage?.CreatedAt;

        public Image? Avatar { get; set; }
        public User Owner { get; set; }
        public ICollection<ChannelMember> Members { get; set; } = new List<ChannelMember>();
        public ICollection<Message>? Messages { get; set; }
    }
}