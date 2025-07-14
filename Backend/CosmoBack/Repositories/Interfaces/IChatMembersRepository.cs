using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IChatMembersRepository : IRepository<ChatMember>
    {
        Task<ChatMember> GetByChatAndUserIdAsync(Guid chatId, Guid userId);
        Task<ChatMember> GetNotificationStatusAsync(Guid chatId, Guid userId);
    }
}