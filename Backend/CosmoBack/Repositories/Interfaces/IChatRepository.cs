using CosmoBack.Models;
namespace CosmoBack.Repositories.Interfaces
{
    public interface IChatRepository : IRepository<Chat>
    {
        Task<IEnumerable<Chat>> GetChatsByUserIdAsync(Guid userId);
    }
}
