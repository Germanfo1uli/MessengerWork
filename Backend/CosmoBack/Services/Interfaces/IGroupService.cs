using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IGroupService
    {
        Task<GroupDto> GetGroupByIdAsync(Guid id);
        Task<IEnumerable<GroupDto>> GetUserGroupsAsync(Guid userId);
        Task<GroupDto> CreateGroupAsync(Guid ownerId, string name, bool isPublic, string? groupTag, string? description, Guid? avatarImageId);
        Task DeleteGroupAsync(Guid groupId);
        Task<GroupMessageDto> SendMessageAsync(Guid groupId, Guid senderId, string content);
        Task<GroupDto> ToggleFavoriteGroupAsync(Guid groupId, Guid userId, bool favorite); 
    }
}