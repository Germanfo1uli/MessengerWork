namespace CosmoBack.Models.Dtos
{
    public class BaseMessageDto
    {
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public string Comment { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; } = default!;
        public Guid? AvatarImageId { get; set; }
        public MessageReplyDto? ReplyTo { get; set; }
        public ImageDto? AvatarImage { get; set; }
    }

    public class MessageReplyDto
    {
        public Guid MessageId { get; set; }
        public Guid SenderId { get; set; }
        public string Username { get; set; } = default!;
        public string? Comment { get; set; }
    }
}