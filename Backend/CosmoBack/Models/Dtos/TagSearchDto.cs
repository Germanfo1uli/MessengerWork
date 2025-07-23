namespace CosmoBack.Models.Dtos
{
    public class TagSearchDto
    {
        public Guid Id { get; set; }
        public Guid? SecondUserId { get; set; }
        public long? PublicId { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string Tag { get; set; } = default!;
        public EntityType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public string? LastMessage { get; set; }
        public Guid? AvatarImageId { get; set; }
        public int? MembersCount { get; set; }
        public bool? IsFavorite { get; set; }
        public string? Username { get; set; }
        public OnlineStatus? OnlineStatus { get; set; }
        public string? ContactTag { get; set; }
        public string? Phone { get; set; }
        public string? Bio { get; set; }
    }

    public enum EntityType
    {
        Chat,
        Group,
        Channel,
        Contact,
        User 
    }

}