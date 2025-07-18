using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface IChatMembersService
    {
        Task<ChatMember> GetChatMemberAsync(Guid chatId, Guid userId);
        Task UpdateNotificationStatusAsync(Guid chatId, Guid userId, bool isEnabled);
        Task RemoveMemberFromChatAsync(Guid chatId, Guid userId);
        Task AddChatMemberAsync(ChatMember chatMember);
    }
}