using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IGroupRepository : IRepository<Group>
    {
        Task<IEnumerable<Group>> GetGroupsByUserIdAsync(Guid userId);
        Task<Group> GetGroupByIdWithMessagesAsync(Guid id);
        Task<bool> GroupExistsAsync(string name, Guid ownerId);
        Task<Group> CreateGroupAsync(Group group);
        Task DeleteGroupAsync(Guid groupId);
        Task<IEnumerable<object>> GetGroupsWithDetailsAsync(Guid userId);
    }
}