using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IChatService
    {
        Task<ChatDto> GetChatByIdAsync(Guid id);
        Task<IEnumerable<ChatDto>> GetUserChatsAsync(Guid userId);
        Task<ChatDto> CreateChatAsync(Guid firstUserId, Guid secondUserId);
        Task DeleteChatAsync(Guid chatId);
        Task<ChatMessageDto> SendMessageAsync(Guid? chatId, Guid senderId, Guid secondUserId, string content);
        Task<ChatDto> ToggleFavoriteChatAsync(Guid chatId, bool favorite);
        Task<IEnumerable<ChatDto>> SearchUsersAsync(Guid userId, string searchQuery);
    }
}

