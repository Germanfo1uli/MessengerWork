using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Services.Classes
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IChatMembersRepository _chatMembersRepository;
        private readonly INotificationService _notificationService;
        private readonly CosmoDbContext _context;
        private readonly ILogger<ChatService> _logger;

        public ChatService(
            IChatRepository chatRepository,
            IMessageRepository messageRepository,
            IUserRepository userRepository,
            IChatMembersRepository chatMembersRepository,
            INotificationService notificationService,
            CosmoDbContext context,
            ILogger<ChatService> logger)
        {
            _chatRepository = chatRepository ?? throw new ArgumentNullException(nameof(chatRepository));
            _messageRepository = messageRepository ?? throw new ArgumentNullException(nameof(messageRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _chatMembersRepository = chatMembersRepository ?? throw new ArgumentNullException(nameof(chatMembersRepository));
            _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<ChatDto> GetChatByIdAsync(Guid id)
        {
            _logger.LogInformation("Getting chat with ID {ChatId}", id);
            try
            {
                var chat = await _chatRepository.GetChatByIdWithMessagesAsync(id);
                if (chat == null)
                {
                    _logger.LogWarning("Chat with ID {ChatId} not found", id);
                    throw new KeyNotFoundException($"Чат с ID {id} не найден");
                }

                return new ChatDto
                {
                    Id = chat.Id,
                    FirstUserId = chat.FirstUserId,
                    SecondUserId = chat.SecondUserId,
                    CreatedAt = chat.CreatedAt,
                    LastMessageAt = chat.Messages?.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving chat with ID {ChatId}", id);
                throw new Exception($"Ошибка при получении чата: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<ChatDto>> GetUserChatsAsync(Guid userId)
        {
            _logger.LogInformation("Getting chats for user {UserId}", userId);
            try
            {
                var chats = await _context.Chats
                    .Where(c => c.FirstUserId == userId || c.SecondUserId == userId)
                    .Select(c => new ChatDto
                    {
                        Id = c.Id,
                        FirstUserId = c.FirstUserId,
                        SecondUserId = c.SecondUserId,
                        CreatedAt = c.CreatedAt,
                        LastMessageAt = c.Messages != null
                            ? c.Messages.OrderByDescending(m => m.CreatedAt).Select(m => (DateTime?)m.CreatedAt).FirstOrDefault()
                            : null
                    })
                    .ToListAsync();

                _logger.LogInformation("Retrieved {ChatCount} chats for user {UserId}", chats.Count, userId);
                return chats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving chats for user {UserId}", userId);
                throw new Exception($"Ошибка при получении чатов пользователя: {ex.Message}", ex);
            }
        }

        public async Task<ChatDto> CreateChatAsync(Guid firstUserId, Guid secondUserId)
        {
            _logger.LogInformation("Creating chat between users {FirstUserId} and {SecondUserId}", firstUserId, secondUserId);
            try
            {
                if (firstUserId == secondUserId)
                {
                    _logger.LogWarning("Attempt to create chat with same user {UserId}", firstUserId);
                    throw new InvalidOperationException("Нельзя создать чат с самим собой");
                }

                var firstUser = await _userRepository.GetByIdAsync(firstUserId);
                var secondUser = await _userRepository.GetByIdAsync(secondUserId);

                if (firstUser == null || secondUser == null)
                {
                    _logger.LogWarning("One or both users not found: FirstUserId={FirstUserId}, SecondUserId={SecondUserId}", firstUserId, secondUserId);
                    throw new KeyNotFoundException("Один или оба пользователя не найдены");
                }

                if (await _chatRepository.ChatExistsBetweenUsersAsync(firstUserId, secondUserId))
                {
                    _logger.LogWarning("Chat already exists between users {FirstUserId} and {SecondUserId}", firstUserId, secondUserId);
                    throw new InvalidOperationException("Чат между этими пользователями уже существует");
                }

                var chat = new Chat
                {
                    Id = Guid.NewGuid(),
                    FirstUserId = firstUserId,
                    SecondUserId = secondUserId,
                    CreatedAt = DateTime.UtcNow
                };

                await _chatRepository.CreateChatAsync(chat);

                // Создание записей в ChatMembers
                var chatMembers = new List<ChatMember>
                {
                    new ChatMember
                    {
                        Id = Guid.NewGuid(),
                        ChatId = chat.Id,
                        UserId = firstUserId,
                        Notifications = true
                    },
                    new ChatMember
                    {
                        Id = Guid.NewGuid(),
                        ChatId = chat.Id,
                        UserId = secondUserId,
                        Notifications = true
                    }
                };

                foreach (var member in chatMembers)
                {
                    await _chatMembersRepository.AddAsync(member);
                }

                // Создание записей в Notifications
                var notifications = new List<Notification>
                {
                    new Notification
                    {
                        Id = Guid.NewGuid(),
                        UserId = firstUserId,
                        ChatId = chat.Id,
                        GroupId = null,
                        ChannelId = null,
                        IsEnabled = true
                    },
                    new Notification
                    {
                        Id = Guid.NewGuid(),
                        UserId = secondUserId,
                        ChatId = chat.Id,
                        GroupId = null,
                        ChannelId = null,
                        IsEnabled = true
                    }
                };

                foreach (var notification in notifications)
                {
                    await _notificationService.CreateNotificationAsync(notification);
                }

                _logger.LogInformation("Chat {ChatId} created successfully with members {FirstUserId} and {SecondUserId} and notifications", chat.Id, firstUserId, secondUserId);

                return new ChatDto
                {
                    Id = chat.Id,
                    FirstUserId = chat.FirstUserId,
                    SecondUserId = chat.SecondUserId,
                    CreatedAt = chat.CreatedAt,
                    LastMessageAt = null
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating chat between users {FirstUserId} and {SecondUserId}", firstUserId, secondUserId);
                throw new Exception($"Ошибка при создании чата: {ex.Message}", ex);
            }
        }

        public async Task DeleteChatAsync(Guid chatId)
        {
            _logger.LogInformation("Deleting chat {ChatId}", chatId);
            try
            {
                var chat = await _chatRepository.GetChatByIdWithMessagesAsync(chatId);
                if (chat == null)
                {
                    _logger.LogWarning("Chat {ChatId} not found", chatId);
                    throw new KeyNotFoundException($"Чат с ID {chatId} не найден");
                }

                await _chatMembersRepository.DeleteByChatIdAsync(chatId);
                await _notificationService.DeleteNotificationsByChatIdAsync(chatId);
                await _chatRepository.DeleteChatAsync(chatId);
                _logger.LogInformation("Chat {ChatId} deleted successfully", chatId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting chat {ChatId}", chatId);
                throw new Exception($"Ошибка при удалении чата: {ex.Message}", ex);
            }
        }

        public async Task<ChatMessageDto> SendMessageAsync(Guid chatId, Guid senderId, string content)
        {
            _logger.LogInformation("Sending message in chat {ChatId} by user {SenderId}", chatId, senderId);
            try
            {
                var chat = await _chatRepository.GetChatByIdWithMessagesAsync(chatId);
                if (chat == null)
                {
                    _logger.LogWarning("Chat {ChatId} not found", chatId);
                    throw new KeyNotFoundException($"Чат с ID {chatId} не найден");
                }

                if (chat.FirstUserId != senderId && chat.SecondUserId != senderId)
                {
                    _logger.LogWarning("Sender {SenderId} is not a member of chat {ChatId}", senderId, chatId);
                    throw new UnauthorizedAccessException("Отправитель не является участником чата");
                }

                var message = new Message
                {
                    Id = Guid.NewGuid(),
                    ChatId = chatId,
                    SenderId = senderId,
                    Comment = content,
                    CreatedAt = DateTime.UtcNow
                };

                await _messageRepository.AddAsync(message);
                _logger.LogInformation("Message {MessageId} sent in chat {ChatId} by user {SenderId}", message.Id, chatId, senderId);

                return new ChatMessageDto
                {
                    Id = message.Id,
                    ChatId = message.ChatId,
                    SenderId = message.SenderId,
                    Comment = message.Comment,
                    CreatedAt = message.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message in chat {ChatId} by user {SenderId}", chatId, senderId);
                throw new Exception($"Ошибка при отправке сообщения: {ex.Message}", ex);
            }
        }
    }
}