using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IChatRepository : IRepository<Chat>
    {
        Task<IEnumerable<Chat>> GetChatsByUserIdAsync(Guid userId);
        Task<Chat> GetChatByIdWithMessagesAsync(Guid id);
        Task<bool> ChatExistsBetweenUsersAsync(Guid firstUserId, Guid secondUserId);
        Task<Chat> CreateChatAsync(Chat chat);
        Task DeleteChatAsync(Guid chatId);
        Task<IEnumerable<object>> GetChatsWithDetailsAsync(Guid userId);
        Task<IEnumerable<object>> GetChatsWithDetailsByQueryAsync(Guid userId, string searchQuery);
    }
}