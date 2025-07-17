using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IGroupMembersRepository
    {
        Task AddAsync(GroupMember groupMember);
        Task DeleteByGroupIdAsync(Guid groupId);
        Task<GroupMember> GetByGroupAndUserIdAsync(Guid groupId, Guid userId); 
    }
}