namespace CosmoBack.Models.Dtos
{
    public class ReplyDto
    {
        public Guid Id { get; set; }
        public Guid OriginalMessageId { get; set; }
        public Guid ReplyMessageId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Навигационные свойства
        public Message OriginalMessage { get; set; }
        public Message ReplyMessage { get; set; }
    }
}