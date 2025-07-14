using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface IChatService
    {
        Task<Chat> GetChatByIdAsync(Guid id);
        Task<IEnumerable<Chat>> GetUserChatsAsync(Guid userId);
        Task<Chat> CreateChatAsync(Guid firstUserId, Guid secondUserId);
        Task DeleteChatAsync(Guid chatId);
        Task<Message> SendMessageAsync(Guid chatId, Guid senderId, string content);
    }
}