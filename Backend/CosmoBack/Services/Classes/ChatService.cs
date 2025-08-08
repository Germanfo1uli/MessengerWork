using CosmoBack.CosmoDBContext;
using CosmoBack.Hubs;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CosmoBack.Services.Classes
{
    public class ChatService(
        IChatRepository chatRepository,
        IMessageRepository messageRepository,
        IUserRepository userRepository,
        IChatMembersRepository chatMembersRepository,
        INotificationService notificationService,
        IReactionRepository reactionRepository,
        CosmoDbContext context,
        ILogger<ChatService> logger,
        IHttpContextAccessor httpContextAccessor) : IChatService
    {
        private readonly IChatRepository _chatRepository = chatRepository;
        private readonly IMessageRepository _messageRepository = messageRepository;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IChatMembersRepository _chatMembersRepository = chatMembersRepository;
        private readonly INotificationService _notificationService = notificationService;
        private readonly IReactionRepository _reactionRepository = reactionRepository;
        private readonly CosmoDbContext _context = context;
        private readonly ILogger<ChatService> _logger = logger;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public async Task<ChatDto> GetChatByIdAsync(Guid id)
        {
            _logger.LogInformation("Getting chat with ID {ChatId}", id);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));

                var chats = await _chatRepository.GetChatsWithDetailsAsync(currentUserId);
                var chatData = chats.FirstOrDefault(c => (c.GetType().GetProperty("Chat").GetValue(c) as Chat)?.Id == id);

                if (chatData == null)
                {
                    _logger.LogWarning("Chat with ID {ChatId} not found for user {UserId}", id, currentUserId);
                    throw new KeyNotFoundException($"Чат с ID {id} не найден");
                }

                var chat = chatData.GetType().GetProperty("Chat").GetValue(chatData) as Chat;
                var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chat.Id, currentUserId);
                var lastMessageData = chatData.GetType().GetProperty("LastMessageData").GetValue(chatData);
                var secondUser = chatData.GetType().GetProperty("SecondUser").GetValue(chatData);

                var lastMessageId = lastMessageData != null
                    ? (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message)?.Id : (Guid?)null;

                var aggregatedReactions = lastMessageId.HasValue
                    ? await _reactionRepository.GetAggregatedByMessageIdAsync(lastMessageId.Value) : new List<(string Emoji, int Count, List<Reaction> Reactions)>();

                var chatDto = new ChatDto
                {
                    Id = chat.Id,
                    PublicId = chat.PublicId,
                    IsFavorite = chatMember?.IsFavorite ?? false,
                    FirstUserId = chat.FirstUserId,
                    SecondUserId = chat.SecondUserId,
                    CreatedAt = chat.CreatedAt,
                    LastMessageAt = lastMessageData != null
                        ? (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message)?.CreatedAt : null,
                    LastMessage = lastMessageData != null ? new ChatMessageDto
                    {
                        Id = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).Id,
                        ChatId = (Guid)(lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).ChatId,
                        SenderId = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).SenderId,
                        Comment = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).Comment,
                        CreatedAt = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).CreatedAt,
                        Username = lastMessageData.GetType().GetProperty("Username").GetValue(lastMessageData)?.ToString() ?? string.Empty,
                        AvatarImageId = lastMessageData.GetType().GetProperty("AvatarImageId").GetValue(lastMessageData) as Guid?,
                        Reactions = aggregatedReactions.Select(r => new AggregatedReactionDto
                        {
                            Emoji = r.Emoji,
                            Count = r.Count,
                            UserReactions = r.Reactions.Select(re => new ReactionDto
                            {
                                Id = re.Id,
                                UserId = re.UserId,
                                Username = re.User.Username,
                                Emoji = re.Emoji,
                                CreatedAt = re.CreatedAt
                            }).ToList()
                        }).ToList()
                    } : null,
                    SecondUser = secondUser != null ? new SecondUserDto
                    {
                        Username = secondUser.GetType().GetProperty("Username").GetValue(secondUser)?.ToString() ?? string.Empty,
                        OnlineStatus = (OnlineStatus)secondUser.GetType().GetProperty("OnlineStatus").GetValue(secondUser),
                        ContactTag = secondUser.GetType().GetProperty("ContactTag").GetValue(secondUser)?.ToString()
                    } : null
                };

                return chatDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving chat with ID {ChatId}", id);
                throw new Exception($"Ошибка при получении чата: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<(ChatDto, ImageDto?)>> GetUserChatsAsync(Guid userId)
        {
            _logger.LogInformation("Getting chats for user {UserId}", userId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (userId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to access chats for user {UserId}", currentUserId, userId);
                    throw new UnauthorizedAccessException("Недостаточно прав для получения чатов другого пользователя");
                }

                var chats = await _chatRepository.GetChatsWithDetailsAsync(userId);
                var result = new List<(ChatDto, ImageDto?)>();

                foreach (var chatData in chats)
                {
                    var chat = chatData.GetType().GetProperty("Chat").GetValue(chatData) as Chat;
                    var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chat.Id, userId);
                    var lastMessageData = chatData.GetType().GetProperty("LastMessageData").GetValue(chatData);
                    var secondUser = chatData.GetType().GetProperty("SecondUser").GetValue(chatData);

                    var lastMessageId = lastMessageData != null
                        ? (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message)?.Id
                        : (Guid?)null;

                    var aggregatedReactions = lastMessageId.HasValue
                        ? await _reactionRepository.GetAggregatedByMessageIdAsync(lastMessageId.Value)
                        : new List<(string Emoji, int Count, List<Reaction> Reactions)>();

                    var chatDto = new ChatDto
                    {
                        Id = chat.Id,
                        PublicId = chat.PublicId,
                        IsFavorite = chatMember?.IsFavorite ?? false,
                        FirstUserId = chat.FirstUserId,
                        SecondUserId = chat.SecondUserId,
                        CreatedAt = chat.CreatedAt,
                        LastMessageAt = lastMessageData != null
                            ? (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message)?.CreatedAt
                            : null,
                        LastMessage = lastMessageData != null ? new ChatMessageDto
                        {
                            Id = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).Id,
                            ChatId = (Guid)(lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).ChatId,
                            SenderId = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).SenderId,
                            Comment = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).Comment,
                            CreatedAt = (lastMessageData.GetType().GetProperty("Message").GetValue(lastMessageData) as Message).CreatedAt,
                            Username = lastMessageData.GetType().GetProperty("Username").GetValue(lastMessageData)?.ToString() ?? string.Empty,
                            AvatarImageId = lastMessageData.GetType().GetProperty("AvatarImageId").GetValue(lastMessageData) as Guid?,
                            Reactions = aggregatedReactions.Select(r => new AggregatedReactionDto
                            {
                                Emoji = r.Emoji,
                                Count = r.Count,
                                UserReactions = r.Reactions.Select(re => new ReactionDto
                                {
                                    Id = re.Id,
                                    UserId = re.UserId,
                                    Username = re.User.Username,
                                    Emoji = re.Emoji,
                                    CreatedAt = re.CreatedAt
                                }).ToList()
                            }).ToList()
                        } : null,
                        SecondUser = secondUser != null ? new SecondUserDto
                        {
                            Username = secondUser.GetType().GetProperty("Username").GetValue(secondUser)?.ToString() ?? string.Empty,
                            OnlineStatus = (OnlineStatus)secondUser.GetType().GetProperty("OnlineStatus").GetValue(secondUser),
                            ContactTag = secondUser.GetType().GetProperty("ContactTag").GetValue(secondUser)?.ToString()
                        } : null
                    };

                    var avatarImage = chatData.GetType().GetProperty("AvatarImage").GetValue(chatData) as ImageDto;
                    result.Add((chatDto, avatarImage));
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving chats for user {UserId}", userId);
                throw new Exception($"Ошибка при получении списка чатов: {ex.Message}", ex);
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

                var chatMember1 = new ChatMember
                {
                    Id = Guid.NewGuid(),
                    ChatId = chat.Id,
                    UserId = firstUserId,
                    Notifications = true,
                    IsFavorite = false
                };

                var chatMember2 = new ChatMember
                {
                    Id = Guid.NewGuid(),
                    ChatId = chat.Id,
                    UserId = secondUserId,
                    Notifications = true,
                    IsFavorite = false
                };

                await _chatMembersRepository.AddAsync(chatMember1);
                await _chatMembersRepository.AddAsync(chatMember2);

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
                    IsFavorite = false,
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
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                var chat = await _chatRepository.GetChatByIdWithMessagesAsync(chatId);
                if (chat == null)
                {
                    _logger.LogWarning("Chat {ChatId} not found", chatId);
                    throw new KeyNotFoundException($"Чат с ID {chatId} не найден");
                }

                if (chat.FirstUserId != currentUserId && chat.SecondUserId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to delete chat {ChatId}", currentUserId, chatId);
                    throw new UnauthorizedAccessException("Недостаточно прав для удаления чата");
                }

                var messages = await _context.Messages
                    .Where(m => m.ChatId == chatId)
                    .ToListAsync();
                if (messages.Any())
                {
                    _context.Messages.RemoveRange(messages);
                }

                await _chatMembersRepository.DeleteByChatIdAsync(chatId);
                await _notificationService.DeleteNotificationsByChatIdAsync(chatId);
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

        public async Task<ChatMessageDto> SendMessageAsync(Guid? chatId, Guid senderId, Guid secondUserId, string content)
        {
            _logger.LogInformation("Sending message to user {SecondUserId} in chat {ChatId} by user {SenderId}", secondUserId, chatId, senderId);
            try
            {
                var sender = await _userRepository.GetByIdAsync(senderId);
                if (sender == null)
                {
                    _logger.LogWarning("Sender {SenderId} not found", senderId);
                    throw new KeyNotFoundException($"Пользователь с ID {senderId} не найден");
                }

                var secondUser = await _userRepository.GetByIdAsync(secondUserId);
                if (secondUser == null)
                {
                    _logger.LogWarning("Second user {SecondUserId} not found", secondUserId);
                    throw new KeyNotFoundException($"Пользователь с ID {secondUserId} не найден");
                }

                Chat? chat = null;
                if (chatId.HasValue)
                {
                    chat = await _chatRepository.GetChatByIdWithMessagesAsync(chatId.Value);
                    if (chat == null)
                    {
                        _logger.LogWarning("Chat {ChatId} not found", chatId);
                        throw new KeyNotFoundException($"Чат с ID {chatId} не найден");
                    }

                    var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatId.Value, senderId);
                    if (chatMember == null)
                    {
                        _logger.LogWarning("Sender {SenderId} is not a member of chat {ChatId}", senderId, chatId);
                        throw new UnauthorizedAccessException("Отправитель не является участником чата");
                    }
                }
                else
                {
                    var existingChat = await _context.Chats
                        .FirstOrDefaultAsync(c =>
                            (c.FirstUserId == senderId && c.SecondUserId == secondUserId) ||
                            (c.FirstUserId == secondUserId && c.SecondUserId == senderId));

                    if (existingChat == null)
                    {
                        chat = new Chat
                        {
                            Id = Guid.NewGuid(),
                            FirstUserId = senderId,
                            SecondUserId = secondUserId,
                            CreatedAt = DateTime.UtcNow
                        };

                        await _chatRepository.CreateChatAsync(chat);

                        var chatMember1 = new ChatMember
                        {
                            Id = Guid.NewGuid(),
                            ChatId = chat.Id,
                            UserId = senderId,
                            Notifications = true,
                            IsFavorite = false
                        };

                        var chatMember2 = new ChatMember
                        {
                            Id = Guid.NewGuid(),
                            ChatId = chat.Id,
                            UserId = secondUserId,
                            Notifications = true,
                            IsFavorite = false
                        };

                        await _chatMembersRepository.AddAsync(chatMember1);
                        await _chatMembersRepository.AddAsync(chatMember2);

                        var notification1 = new Notification
                        {
                            Id = Guid.NewGuid(),
                            UserId = senderId,
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

                        _logger.LogInformation("Chat {ChatId} created successfully between users {FirstUserId} and {SecondUserId}", chat.Id, senderId, secondUserId);
                    }
                    else
                    {
                        chat = existingChat;
                    }
                }

                var message = new Message
                {
                    Id = Guid.NewGuid(),
                    ChatId = chat.Id,
                    SenderId = senderId,
                    Comment = content,
                    CreatedAt = DateTime.UtcNow
                };

                await _messageRepository.AddAsync(message);
                _logger.LogInformation("Message {MessageId} sent in chat {ChatId} by user {SenderId}", message.Id, chat.Id, senderId);

                var messageDto = new ChatMessageDto
                {
                    Id = message.Id,
                    ChatId = (Guid)message.ChatId,
                    SenderId = message.SenderId,
                    Comment = message.Comment,
                    CreatedAt = message.CreatedAt,
                    Username = sender.Username,
                    AvatarImageId = sender.AvatarImageId
                };

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
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));

                var chatMember = await _chatMembersRepository.GetByChatAndUserIdAsync(chatId, currentUserId);
                if (chatMember == null)
                {
                    _logger.LogWarning("User {UserId} is not a member of chat {ChatId}", currentUserId, chatId);
                    throw new KeyNotFoundException($"Пользователь не является участником чата {chatId}");
                }

                chatMember.IsFavorite = favorite;
                await _context.SaveChangesAsync();

                var chat = await _chatRepository.GetChatByIdWithMessagesAsync(chatId);
                if (chat == null)
                {
                    _logger.LogWarning("Chat {ChatId} not found", chatId);
                    throw new KeyNotFoundException($"Чат с ID {chatId} не найден");
                }

                var lastMessage = await _context.Messages
                    .Where(m => m.ChatId == chatId)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new ChatMessageDto
                        {
                            Id = m.Id,
                            ChatId = (Guid)m.ChatId,
                            SenderId = m.SenderId,
                            Comment = m.Comment,
                            CreatedAt = m.CreatedAt,
                            Username = u.Username,
                            AvatarImageId = u.AvatarImageId
                        })
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();

                _logger.LogInformation("Favorite status for chat {ChatId} updated to {Favorite} for user {UserId}", chatId, favorite, currentUserId);
                return new ChatDto
                {
                    Id = chat.Id,
                    PublicId = chat.PublicId,
                    IsFavorite = chatMember.IsFavorite,
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