using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IChatMembersRepository : IRepository<ChatMember>
    {
        Task<ChatMember> GetByChatAndUserIdAsync(Guid chatId, Guid userId);
        Task DeleteByChatIdAsync(Guid chatId);
    }
}