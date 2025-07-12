using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Username { get; set; }

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; }

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Bio { get; set; }

        [ForeignKey("AvatarImage")]
        public Guid? AvatarImageId { get; set; }

        public DateTime? LastSeen { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        [MaxLength(50)]
        public string? PublicName { get; set; }

        public OnlineStatus OnlineStatus { get; set; } = OnlineStatus.Offline;

        public Theme Theme { get; set; } = Theme.Light;

        // Навигационные свойства
        public Image? AvatarImage { get; set; } 
        public ICollection<Chat>? ChatsAsFirstUser { get; set; }
        public ICollection<Chat>? ChatsAsSecondUser { get; set; }
        public ICollection<Group>? OwnedGroups { get; set; }
        public ICollection<Channel>? OwnedChannels { get; set; }

        // Раскомментируйте остальные связи по мере необходимости
        // public ICollection<GroupMember> GroupMemberships { get; set; }
        // public ICollection<ChannelMember> ChannelMemberships { get; set; }
        // public ICollection<Message> SentMessages { get; set; }
        // public ICollection<Contact> Contacts { get; set; }
        // public ICollection<Contact> ContactOf { get; set; }
        // public ICollection<Token> Tokens { get; set; }
        // public ICollection<OAuth> OAuths { get; set; }
        // public ICollection<Reaction> Reactions { get; set; }
    }

    public enum OnlineStatus
    {
        Offline,
        Online,
        Away,
        DoNotDisturb
    }

    public enum Theme
    {
        Light,
        Dark,
        System
    }
}