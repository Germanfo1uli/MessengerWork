namespace CosmoBack.Models.Dtos
{
    public class ChannelDto
    {
        public Guid Id { get; set; }
        public long PublicId { get; set; }
        public Guid OwnerId { get; set; }
        public string Name { get; set; } = default!;
        public bool IsPublic { get; set; }
        public string? ChannelTag { get; set; }
        public string? Description { get; set; }
        public Guid? AvatarImageId { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public int MembersNumber { get; set; }
        public bool IsFavorite { get; set; } 
        public DateTime? LastMessageAt { get; set; }
        public ChannelMessageDto? LastMessage { get; set; }
    }

    public class ChannelMessageDto : BaseMessageDto
    {
        public Guid? ChannelId { get; set; }
    }
}