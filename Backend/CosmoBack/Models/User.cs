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
        public string Username { get; set; } = default!;

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; } = default!;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = default!;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Bio { get; set; }

        [ForeignKey("Image")]
        public Guid? AvatarImageId { get; set; }

        public Image? AvatarImage { get; set; }

        public DateTime? LastSeen { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        [MaxLength(50)]
        public string? PublicName { get; set; }

        public OnlineStatus OnlineStatus { get; set; } = OnlineStatus.Offline;

        public Theme Theme { get; set; } = Theme.Light;

        // Коллекции и навигационные свойства
        public ICollection<Chat>? ChatsAsFirstUser { get; set; }
        public ICollection<Chat>? ChatsAsSecondUser { get; set; }
        public ICollection<Group>? OwnedGroups { get; set; }
        public ICollection<Channel>? OwnedChannels { get; set; }
        public ICollection<GroupMember>? GroupMember { get; set; }
        public ICollection<ChannelMember>? ChannelMember { get; set; }
        public ICollection<Message>? SentMessages { get; set; }
        public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
        public ICollection<Contact> ContactOf { get; set; } = new List<Contact>();
        public ICollection<Token>? Tokens { get; set; }
        public ICollection<UserOAuth>? OAuths { get; set; }
        public ICollection<Reaction>? Reactions { get; set; }
        public ICollection<Payment>? Payments { get; set; }
        public ICollection<Subscription>? Subscriptions { get; set; }
        public ICollection<Notification>? Notifications { get; set; }
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