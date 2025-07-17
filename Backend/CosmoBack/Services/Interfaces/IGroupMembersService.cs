using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface IGroupMembersService
    {
        Task AddMemberAsync(Guid groupId, Guid userId, GroupRole role);
        Task RemoveMemberAsync(Guid groupId, Guid userId);
    }
}