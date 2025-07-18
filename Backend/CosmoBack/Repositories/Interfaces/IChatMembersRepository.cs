using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IChatMembersRepository
    {
        Task AddAsync(ChatMember chatMember);
        Task DeleteByChatIdAsync(Guid chatId);
        Task<ChatMember> GetByChatAndUserIdAsync(Guid chatId, Guid userId);
        Task UpdateAsync(ChatMember chatMember); 
        Task DeleteAsync(Guid chatMemberId);
    }
}