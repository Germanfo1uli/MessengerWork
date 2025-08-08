namespace CosmoBack.Models.Dtos
{
    public class ReactionDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; } = default!;
        public string Emoji { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
    }
    public class AggregatedReactionDto
    {
        public string Emoji { get; set; } = default!;
        public int Count { get; set; }
        public List<ReactionDto> UserReactions { get; set; } = new List<ReactionDto>(); // Для списка пользователей
    }
}
