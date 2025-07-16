namespace CosmoBack.Models.Dtos
{
    public class ChatMessageDto
    {
        public Guid Id { get; set; }
        public Guid? ChatId { get; set; }
        public Guid SenderId { get; set; }
        public string Comment { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; } = default!;
        public Guid? AvatarImageId { get; set; }
    }
}