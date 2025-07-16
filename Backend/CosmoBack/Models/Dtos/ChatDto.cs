namespace CosmoBack.Models.Dtos
{
    public class ChatDto
    {
        public Guid Id { get; set; }
        public Guid FirstUserId { get; set; }
        public Guid SecondUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public ChatMessageDto? LastMessage { get; set; }
        public List<ChatMessageDto> Messages { get; set; } = new List<ChatMessageDto>();
    }
}