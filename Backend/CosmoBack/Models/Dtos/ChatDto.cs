namespace CosmoBack.Models.Dtos
{
    public class ChatDto
    {
        public Guid Id { get; set; }
        public long PublicId { get; set; }
        public bool IsFavorite { get; set; }
        public Guid FirstUserId { get; set; }
        public Guid SecondUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public ChatMessageDto? LastMessage { get; set; }
        public SecondUserDto? SecondUser { get; set; }
    }

    public class SecondUserDto
    {
        public string Username { get; set; } = default!;
        public OnlineStatus OnlineStatus { get; set; }
        public string? ContactTag { get; set; }
        public ImageDto? AvatarImage { get; set; }
    }
}