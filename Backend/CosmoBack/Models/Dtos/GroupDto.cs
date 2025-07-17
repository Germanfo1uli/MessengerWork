namespace CosmoBack.Models.Dtos
{
    public class GroupDto
    {
        public Guid Id { get; set; }
        public long PublicId { get; set; }
        public Guid OwnerId { get; set; }
        public string Name { get; set; } = default!;
        public bool IsPublic { get; set; }
        public string? GroupTag { get; set; }
        public string? Description { get; set; }
        public Guid? AvatarImageId { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsFavorite { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public GroupMessageDto? LastMessage { get; set; }
    }
}