using CosmoBack.CosmoDBContext;
using CosmoBack.Hubs;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Services.Classes
{
    public class ChatService(
        IChatRepository chatRepository,
        IMessageRepository messageRepository,
        IUserRepository userRepository,
        IChatMembersRepository chatMembersRepository,
        INotificationService notificationService,
        CosmoDbContext context,
        ILogger<ChatService> logger,
        IHubContext<ChatHub> hubContext) : IChatService
    {
        private readonly IChatRepository _chatRepository = chatRepository;
        private readonly IMessageRepository _messageRepository = messageRepository;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IChatMembersRepository _chatMembersRepository = chatMembersRepository;
        private readonly INotificationService _notificationService = notificationService;
        private readonly CosmoDbContext _context = context;
        private readonly ILogger<ChatService> _logger = logger ;
        private readonly IHubContext<ChatHub> _hubContext = hubContext;

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

                var lastMessage = await _context.Messages
                    .Where(m => m.ChatId == id)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new ChatMessageDto
                        {
                            Id = m.Id,
                            ChatId = m.ChatId,
                            SenderId = m.SenderId,
                            Comment = m.Comment,
                            CreatedAt = m.CreatedAt,
                            Username = u.Username,
                            AvatarImageId = u.AvatarImageId
                        })
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();

                return new ChatDto
                {
                    Id = chat.Id,
                    PublicId = chat.PublicId,
                    Favorite = chat.Favorite,
                    FirstUserId = chat.FirstUserId,
                    SecondUserId = chat.SecondUserId,
                    CreatedAt = chat.CreatedAt,
                    LastMessageAt = lastMessage?.CreatedAt,
                    LastMessage = lastMessage
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
                var chats = await _chatRepository.GetChatsWithDetailsAsync(userId);
                var chatDtos = chats.Select(c => new ChatDto
                {
                    Id = (c.GetType().GetProperty("Chat").GetValue(c) as Chat).Id,
                    PublicId = (c.GetType().GetProperty("Chat").GetValue(c) as Chat).PublicId,
                    Favorite = (c.GetType().GetProperty("Chat").GetValue(c) as Chat).Favorite,
                    FirstUserId = (c.GetType().GetProperty("Chat").GetValue(c) as Chat).FirstUserId,
                    SecondUserId = (c.GetType().GetProperty("Chat").GetValue(c) as Chat).SecondUserId,
                    CreatedAt = (c.GetType().GetProperty("Chat").GetValue(c) as Chat).CreatedAt,
                    LastMessageAt = c.GetType().GetProperty("LastMessageData").GetValue(c) != null
                        ? (c.GetType().GetProperty("LastMessageData").GetValue(c).GetType().GetProperty("Message").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c)) as Message)?.CreatedAt
                        : null,
                    LastMessage = c.GetType().GetProperty("LastMessageData").GetValue(c) != null ? new ChatMessageDto
                    {
                        Id = (c.GetType().GetProperty("LastMessageData").GetValue(c).GetType().GetProperty("Message").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c)) as Message).Id,
                        ChatId = (c.GetType().GetProperty("LastMessageData").GetValue(c).GetType().GetProperty("Message").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c)) as Message).ChatId,
                        SenderId = (c.GetType().GetProperty("LastMessageData").GetValue(c).GetType().GetProperty("Message").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c)) as Message).SenderId,
                        Comment = (c.GetType().GetProperty("LastMessageData").GetValue(c).GetType().GetProperty("Message").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c)) as Message).Comment,
                        CreatedAt = (c.GetType().GetProperty("LastMessageData").GetValue(c).GetType().GetProperty("Message").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c)) as Message).CreatedAt,
                        Username = c.GetType().GetProperty("LastMessageData").GetValue(c)?.GetType().GetProperty("Username").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c))?.ToString() ?? string.Empty,
                        AvatarImageId = c.GetType().GetProperty("LastMessageData").GetValue(c)?.GetType().GetProperty("AvatarImageId").GetValue(c.GetType().GetProperty("LastMessageData").GetValue(c)) as Guid?
                    } : null,
                    SecondUser = c.GetType().GetProperty("SecondUser").GetValue(c) != null ? new SecondUserDto
                    {
                        Username = c.GetType().GetProperty("SecondUser").GetValue(c).GetType().GetProperty("Username").GetValue(c.GetType().GetProperty("SecondUser").GetValue(c)).ToString(),
                        OnlineStatus = (OnlineStatus)c.GetType().GetProperty("SecondUser").GetValue(c).GetType().GetProperty("OnlineStatus").GetValue(c.GetType().GetProperty("SecondUser").GetValue(c)),
                        ContactTag = c.GetType().GetProperty("SecondUser").GetValue(c)?.GetType().GetProperty("ContactTag").GetValue(c.GetType().GetProperty("SecondUser").GetValue(c))?.ToString()
                    } : null
                }).ToList();

                _logger.LogInformation("Retrieved {ChatCount} chats for user {UserId}", chatDtos.Count, userId);
                return chatDtos;
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
                var firstUser = await _userRepository.GetByIdAsync(firstUserId);
                if (firstUser == null)
                {
                    _logger.LogWarning("First user {FirstUserId} not found", firstUserId);
                    throw new KeyNotFoundException("Первый пользователь не найден");
                }

                var secondUser = await _userRepository.GetByIdAsync(secondUserId);
                if (secondUser == null)
                {
                    _logger.LogWarning("Second user {SecondUserId} not found", secondUserId);
                    throw new KeyNotFoundException("Второй пользователь не найден");
                }

                if (await _chatRepository.ChatExistsBetweenUsersAsync(firstUserId, secondUserId))
                {
                    _logger.LogWarning("Chat already exists between users {FirstUserId} and {SecondUserId}", firstUserId, secondUserId);
                    throw new InvalidOperationException("Чат между пользователями уже существует");
                }

                var chat = new Chat
                {
                    Id = Guid.NewGuid(),
                    FirstUserId = firstUserId,
                    SecondUserId = secondUserId,
                    CreatedAt = DateTime.UtcNow
                };

                await _chatRepository.CreateChatAsync(chat);

                var notification1 = new Notification
                {
                    Id = Guid.NewGuid(),
                    UserId = firstUserId,
                    ChatId = chat.Id,
                    IsEnabled = true
                };

                var notification2 = new Notification
                {
                    Id = Guid.NewGuid(),
                    UserId = secondUserId,
                    ChatId = chat.Id,
                    IsEnabled = true
                };

                await _notificationService.CreateNotificationAsync(notification1);
                await _notificationService.CreateNotificationAsync(notification2);

                _logger.LogInformation("Chat {ChatId} created successfully between users {FirstUserId} and {SecondUserId}", chat.Id, firstUserId, secondUserId);

                return new ChatDto
                {
                    Id = chat.Id,
                    PublicId = chat.PublicId,
                    FirstUserId = chat.FirstUserId,
                    SecondUserId = chat.SecondUserId,
                    CreatedAt = chat.CreatedAt,
                    LastMessageAt = null,
                    LastMessage = null
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

                // Удаление связанных сообщений
                var messages = await _context.Messages
                    .Where(m => m.ChatId == chatId)
                    .ToListAsync();
                if (messages.Any())
                {
                    _context.Messages.RemoveRange(messages);
                }

                // Удаление участников чата
                await _chatMembersRepository.DeleteByChatIdAsync(chatId);
                // Удаление уведомлений
                await _notificationService.DeleteNotificationsByChatIdAsync(chatId);
                // Удаление чата
                await _chatRepository.DeleteChatAsync(chatId);

                await _context.SaveChangesAsync();
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

                var sender = await _userRepository.GetByIdAsync(senderId);
                if (sender == null)
                {
                    _logger.LogWarning("Sender {SenderId} not found", senderId);
                    throw new KeyNotFoundException($"Пользователь с ID {senderId} не найден");
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

                var messageDto = new ChatMessageDto
                {
                    Id = message.Id,
                    ChatId = message.ChatId,
                    SenderId = message.SenderId,
                    Comment = message.Comment,
                    CreatedAt = message.CreatedAt,
                    Username = sender.Username,
                    AvatarImageId = sender.AvatarImageId
                };

                await _hubContext.Clients.Group(chatId.ToString()).SendAsync("ReceiveMessage", messageDto);

                return messageDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message in chat {ChatId} by user {SenderId}", chatId, senderId);
                throw new Exception($"Ошибка при отправке сообщения: {ex.Message}", ex);
            }
        }

        public async Task<ChatDto> ToggleFavoriteChatAsync(Guid chatId, bool favorite)
        {
            _logger.LogInformation("Toggling favorite for chat {ChatId} to {Favorite}", chatId, favorite);
            try
            {
                var chat = await _context.Chats.FindAsync(chatId);
                if (chat == null)
                {
                    _logger.LogWarning("Chat {ChatId} not found", chatId);
                    throw new KeyNotFoundException($"Чат с ID {chatId} не найден");
                }

                chat.Favorite = favorite;
                await _context.SaveChangesAsync();

                var lastMessage = await _context.Messages
                    .Where(m => m.ChatId == chatId)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new ChatMessageDto
                        {
                            Id = m.Id,
                            ChatId = m.ChatId,
                            SenderId = m.SenderId,
                            Comment = m.Comment,
                            CreatedAt = m.CreatedAt,
                            Username = u.Username,
                            AvatarImageId = u.AvatarImageId
                        })
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();

                _logger.LogInformation("Favorite status for chat {ChatId} updated to {Favorite}", chatId, favorite);
                return new ChatDto
                {
                    Id = chat.Id,
                    PublicId = chat.PublicId,
                    Favorite = chat.Favorite,
                    FirstUserId = chat.FirstUserId,
                    SecondUserId = chat.SecondUserId,
                    CreatedAt = chat.CreatedAt,
                    LastMessageAt = lastMessage?.CreatedAt,
                    LastMessage = lastMessage
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling favorite for chat {ChatId}", chatId);
                throw new Exception($"Ошибка при переключении статуса избранного: {ex.Message}", ex);
            }
        }
    }
}