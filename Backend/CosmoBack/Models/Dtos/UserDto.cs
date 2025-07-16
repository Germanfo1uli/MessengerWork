namespace CosmoBack.Models.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = default!;
        public string Phone { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string? Bio { get; set; }
        public Guid? AvatarImageId { get; set; }
        public DateTime? LastSeen { get; set; }
        public bool IsActive { get; set; }
        public string? PublicName { get; set; }
        public OnlineStatus OnlineStatus { get; set; }
        public Theme Theme { get; set; }
    }
}