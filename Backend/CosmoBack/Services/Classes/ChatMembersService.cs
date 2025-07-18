using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
namespace CosmoBack.Services.Classes
{
    public class ChatMembersService(IChatMembersRepository chatMembersRepository) : IChatMembersService
    {
        private readonly IChatMembersRepository _chatMembersRepository = chatMembersRepository;

        public async Task<ChatMember> GetChatMemberAsync(Guid chatId, Guid userId)
        {
            var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatId, userId);
            if (chatMember == null)
            {
                throw new KeyNotFoundException($"Участник чата не найден для chatId {chatId} и userId {userId}");
            }
            return chatMember;
        }

        public async Task UpdateNotificationStatusAsync(Guid chatId, Guid userId, bool isEnabled)
        {
            var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatId, userId);
            if (chatMember == null)
            {
                throw new KeyNotFoundException($"Участник чата не найден для chatId {chatId} и userId {userId}");
            }

            chatMember.Notifications = isEnabled;
            await _chatMembersRepository.UpdateAsync(chatMember);
        }

        public async Task RemoveMemberFromChatAsync(Guid chatId, Guid userId)
        {
            var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatId, userId);
            if (chatMember == null)
            {
                throw new KeyNotFoundException($"Участник чата не найден для chatId {chatId} и userId {userId}");
            }

            await _chatMembersRepository.DeleteAsync(chatMember.Id);
        }

        public async Task AddChatMemberAsync(ChatMember chatMember)
        {
            var existingChatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatMember.ChatId, chatMember.UserId);
            if (existingChatMember != null)
            {
                throw new InvalidOperationException($"Участник с userId {chatMember.UserId} уже добавлен в чат {chatMember.ChatId}");
            }

            await _chatMembersRepository.AddAsync(chatMember);
        }
    }
}