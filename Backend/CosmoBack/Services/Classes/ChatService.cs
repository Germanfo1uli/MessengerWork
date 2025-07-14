using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class ChatService(IChatRepository chatRepository, IMessageRepository messageRepository, IUserRepository userRepository) : IChatService
    {
        private readonly IChatRepository _chatRepository = chatRepository ?? throw new ArgumentNullException(nameof(chatRepository));
        private readonly IMessageRepository _messageRepository = messageRepository ?? throw new ArgumentNullException(nameof(messageRepository));
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));

        public async Task<Chat> GetChatByIdAsync(Guid id)
        {
            try
            {
                var chat = await _chatRepository.GetChatByIdWithMessagesAsync(id);
                if (chat == null)
                {
                    throw new KeyNotFoundException($"Чат с ID {id} не найден");
                }

                chat.LastMessageAt = chat.Messages?.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.CreatedAt;
                return chat;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении чата: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Chat>> GetUserChatsAsync(Guid userId)
        {
            try
            {
                var chats = await _chatRepository.GetChatsByUserIdAsync(userId);
                foreach (var chat in chats)
                {
                    chat.LastMessageAt = chat.Messages?.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.CreatedAt;
                }
                return chats;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении чатов пользователя: {ex.Message}", ex);
            }
        }

        public async Task<Chat> CreateChatAsync(Guid firstUserId, Guid secondUserId)
        {
            try
            {
                if (firstUserId == secondUserId)
                {
                    throw new InvalidOperationException("Нельзя создать чат с самим собой");
                }

                var firstUser = await _userRepository.GetByIdAsync(firstUserId);
                var secondUser = await _userRepository.GetByIdAsync(secondUserId);

                if (firstUser == null || secondUser == null)
                {
                    throw new KeyNotFoundException("Один или оба пользователя не найдены");
                }

                if (await _chatRepository.ChatExistsBetweenUsersAsync(firstUserId, secondUserId))
                {
                    throw new InvalidOperationException("Чат между этими пользователями уже существует");
                }

                var chat = new Chat
                {
                    FirstUserId = firstUserId,
                    SecondUserId = secondUserId,
                    CreatedAt = DateTime.UtcNow
                };

                await _chatRepository.CreateChatAsync(chat);
                return await GetChatByIdAsync(chat.Id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при создании чата: {ex.Message}", ex);
            }
        }

        public async Task DeleteChatAsync(Guid chatId)
        {
            try
            {
                await _chatRepository.DeleteChatAsync(chatId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при удалении чата: {ex.Message}", ex);
            }
        }

        public async Task<Message> SendMessageAsync(Guid chatId, Guid senderId, string comment)
        {
            try
            {
                var chat = await _chatRepository.GetChatByIdWithMessagesAsync(chatId);
                if (chat == null)
                {
                    throw new KeyNotFoundException($"Чат с ID {chatId} не найден");
                }

                if (chat.FirstUserId != senderId && chat.SecondUserId != senderId)
                {
                    throw new UnauthorizedAccessException("Отправитель не является участником чата");
                }

                var message = new Message
                {
                    ChatId = chatId,
                    SenderId = senderId,
                    Comment = comment,
                    CreatedAt = DateTime.UtcNow
                };

                await _messageRepository.AddAsync(message);
                return message;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при отправке сообщения: {ex.Message}", ex);
            }
        }
    }
}