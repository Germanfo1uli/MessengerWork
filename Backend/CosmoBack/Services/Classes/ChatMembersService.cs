using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class ChatMembersService(IChatMembersRepository chatMembersRepository) : IChatMembersService
    {
        private readonly IChatMembersRepository _chatMembersRepository = chatMembersRepository ?? throw new ArgumentNullException(nameof(chatMembersRepository));

        public async Task<ChatMember> GetChatMemberAsync(Guid chatId, Guid userId)
        {
            try
            {
                var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatId, userId);
                if (chatMember == null)
                {
                    throw new KeyNotFoundException($"Участник чата не найден для chatId {chatId} и userId {userId}");
                }
                return chatMember;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении участника чата: {ex.Message}", ex);
            }
        }

        public async Task UpdateNotificationStatusAsync(Guid chatId, Guid userId, bool isEnabled)
        {
            try
            {
                var chatMember = await GetChatMemberAsync(chatId, userId);
                chatMember.Notifications = isEnabled;
                await _chatMembersRepository.UpdateAsync(chatMember);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при обновлении статуса уведомлений: {ex.Message}", ex);
            }
        }

        public async Task RemoveMemberFromChatAsync(Guid chatId, Guid userId)
        {
            try
            {
                var chatMember = await GetChatMemberAsync(chatId, userId);
                await _chatMembersRepository.DeleteAsync(chatMember.Id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при удалении участника из чата: {ex.Message}", ex);
            }
        }

        public async Task AddChatMemberAsync(ChatMember chatMember)
        {
            try
            {
                var existingChatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatMember.ChatId, chatMember.UserId);
                if (existingChatMember != null)
                {
                    throw new InvalidOperationException($"Участник с userId {chatMember.UserId} уже добавлен в чат {chatMember.ChatId}");
                }

                
                await _chatMembersRepository.AddAsync(chatMember);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при добавлении участника чата: {ex.Message}", ex);
            }
        }
    }
}