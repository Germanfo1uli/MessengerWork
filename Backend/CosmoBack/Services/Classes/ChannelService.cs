using CosmoBack.CosmoDBContext;
using CosmoBack.Hubs;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static CosmoBack.Models.ChannelMember;

namespace CosmoBack.Services.Classes
{
    public class ChannelService : IChannelService
    {
        private readonly IChannelRepository _channelRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IChannelMembersRepository _channelMembersRepository;
        private readonly INotificationService _notificationService;
        private readonly CosmoDbContext _context;
        private readonly ILogger<ChannelService> _logger;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChannelService(
            IChannelRepository channelRepository,
            IMessageRepository messageRepository,
            IUserRepository userRepository,
            IChannelMembersRepository channelMembersRepository,
            INotificationService notificationService,
            CosmoDbContext context,
            ILogger<ChannelService> logger,
            IHubContext<ChatHub> hubContext,
            IHttpContextAccessor httpContextAccessor)
        {
            _channelRepository = channelRepository;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _channelMembersRepository = channelMembersRepository;
            _notificationService = notificationService;
            _context = context;
            _logger = logger;
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ChannelDto> GetChannelByIdAsync(Guid id)
        {
            _logger.LogInformation("Getting channel with ID {ChannelId}", id);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                var channel = await _channelRepository.GetChannelByIdWithMessagesAsync(id);
                if (channel == null)
                {
                    _logger.LogWarning("Channel with ID {ChannelId} not found", id);
                    throw new KeyNotFoundException($"Канал с ID {id} не найден");
                }

                var channelMember = await _channelMembersRepository.GetByChannelAndUserIdAsync(id, currentUserId);
                if (channelMember == null)
                {
                    _logger.LogWarning("User {UserId} is not a member of channel {ChannelId}", currentUserId, id);
                    throw new UnauthorizedAccessException("Пользователь не является участником канала");
                }

                var lastMessage = await _context.Messages
                    .Where(m => m.ChannelId == id)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new ChannelMessageDto
                        {
                            Id = m.Id,
                            ChannelId = m.ChannelId,
                            SenderId = m.SenderId,
                            Comment = m.Comment,
                            CreatedAt = m.CreatedAt,
                            Username = u.Username,
                            AvatarImageId = u.AvatarImageId
                        })
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();

                return new ChannelDto
                {
                    Id = channel.Id,
                    PublicId = channel.PublicId,
                    OwnerId = channel.OwnerId,
                    Name = channel.Name,
                    IsPublic = channel.IsPublic,
                    ChannelTag = channel.ChannelTag,
                    Description = channel.Description,
                    AvatarImageId = channel.AvatarImageId,
                    AvatarImage = channel.AvatarImage,
                    CreatedAt = channel.CreatedAt,
                    IsActive = channel.IsActive,
                    MembersNumber = channel.MembersNumber,
                    IsFavorite = channelMember.IsFavorite,
                    LastMessageAt = lastMessage?.CreatedAt,
                    LastMessage = lastMessage
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving channel with ID {ChannelId}", id);
                throw new Exception($"Ошибка при получении канала: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<(ChannelDto, ImageDto?)>> GetUserChannelsAsync(Guid userId)
        {
            _logger.LogInformation("Getting channels for user {UserId}", userId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (userId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to access channels for user {RequestedUserId}", currentUserId, userId);
                    throw new UnauthorizedAccessException("Недостаточно прав для получения каналов другого пользователя");
                }

                var channels = await _channelRepository.GetChannelsByUserIdAsync(userId);
                var channelDtos = new List<(ChannelDto, ImageDto?)>();

                foreach (var channel in channels)
                {
                    var channelMember = await _channelMembersRepository.GetByChannelAndUserIdAsync(channel.Id, userId);
                    var lastMessage = await _context.Messages
                        .Where(m => m.ChannelId == channel.Id)
                        .Join(_context.Users,
                            m => m.SenderId,
                            u => u.Id,
                            (m, u) => new ChannelMessageDto
                            {
                                Id = m.Id,
                                ChannelId = m.ChannelId,
                                SenderId = m.SenderId,
                                Comment = m.Comment,
                                CreatedAt = m.CreatedAt,
                                Username = u.Username,
                                AvatarImageId = u.AvatarImageId
                            })
                        .OrderByDescending(m => m.CreatedAt)
                        .FirstOrDefaultAsync();

                    ImageDto? avatarImage = null;
                    if (channel.AvatarImageId.HasValue)
                    {
                        var image = await _context.Images.FirstOrDefaultAsync(i => i.Id == channel.AvatarImageId);
                        if (image != null)
                        {
                            avatarImage = new ImageDto
                            {
                                Id = image.Id,
                                FileName = image.FileName,
                                MimeType = image.MimeType,
                                FileSize = image.FileSize,
                                Data = image.Data,
                                EntityType = image.EntityType,
                                EntityId = image.EntityId,
                                UploadDate = image.UploadDate,
                                Url = image.Url
                            };
                        }
                    }

                    channelDtos.Add((new ChannelDto
                    {
                        Id = channel.Id,
                        PublicId = channel.PublicId,
                        OwnerId = channel.OwnerId,
                        Name = channel.Name,
                        IsPublic = channel.IsPublic,
                        ChannelTag = channel.ChannelTag,
                        Description = channel.Description,
                        AvatarImageId = channel.AvatarImageId,
                        CreatedAt = channel.CreatedAt,
                        IsActive = channel.IsActive,
                        MembersNumber = channel.MembersNumber,
                        IsFavorite = channelMember?.IsFavorite ?? false,
                        LastMessageAt = lastMessage?.CreatedAt,
                        LastMessage = lastMessage
                    }, avatarImage));
                }

                _logger.LogInformation("Retrieved {ChannelCount} channels for user {UserId}", channelDtos.Count, userId);
                return channelDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving channels for user {UserId}", userId);
                throw new Exception($"Ошибка при получении каналов пользователя: {ex.Message}", ex);
            }
        }

        public async Task<ChannelDto> CreateChannelAsync(Guid ownerId, string name, bool isPublic, string? channelTag, string? description, Guid? avatarImageId)
        {
            _logger.LogInformation("Creating channel with name {Name} by owner {OwnerId}", name, ownerId);
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (ownerId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to create channel as owner {OwnerId}", currentUserId, ownerId);
                    throw new UnauthorizedAccessException("Недостаточно прав для создания канала от имени другого пользователя");
                }

                var owner = await _userRepository.GetByIdAsync(ownerId);
                if (owner == null)
                {
                    _logger.LogWarning("Owner {OwnerId} not found", ownerId);
                    throw new KeyNotFoundException("Владелец канала не найден");
                }

                if (await _channelRepository.ChannelExistsAsync(name, ownerId))
                {
                    _logger.LogWarning("Channel with name {Name} already exists for owner {OwnerId}", name, ownerId);
                    throw new InvalidOperationException("Канал с таким названием уже существует");
                }

                var channel = new Channel
                {
                    Id = Guid.NewGuid(),
                    OwnerId = ownerId,
                    Name = name,
                    IsPublic = isPublic,
                    ChannelTag = channelTag,
                    Description = description,
                    AvatarImageId = avatarImageId,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    MembersNumber = 1,
                    PublicId = await GenerateUniquePublicIdAsync()
                };

                await _context.Channels.AddAsync(channel);

                var channelMember = new ChannelMember
                {
                    Id = Guid.NewGuid(),
                    ChannelId = channel.Id,
                    UserId = ownerId,
                    Role = ChannelRole.Owner,
                    Notifications = true,
                    IsFavorite = false
                };

                await _context.ChannelMembers.AddAsync(channelMember);

                var notification = new Notification
                {
                    Id = Guid.NewGuid(),
                    UserId = ownerId,
                    ChannelId = channel.Id,
                    IsEnabled = true
                };

                await _context.Notifications.AddAsync(notification);

                _logger.LogInformation("Saving changes for channel {ChannelId}", channel.Id);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Changes saved for channel {ChannelId}", channel.Id);

                _logger.LogInformation("Committing transaction for channel {ChannelId}", channel.Id);
                await transaction.CommitAsync();
                _logger.LogInformation("Transaction committed for channel {ChannelId}", channel.Id);

                

                return new ChannelDto
                {
                    Id = channel.Id,
                    PublicId = channel.PublicId,
                    OwnerId = channel.OwnerId,
                    Name = channel.Name,
                    IsPublic = channel.IsPublic,
                    ChannelTag = channel.ChannelTag,
                    Description = channel.Description,
                    AvatarImageId = channel.AvatarImageId,
                    AvatarImage = channel.AvatarImage,
                    CreatedAt = channel.CreatedAt,
                    IsActive = channel.IsActive,
                    MembersNumber = channel.MembersNumber,
                    IsFavorite = false,
                    LastMessageAt = null,
                    LastMessage = null
                };
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _logger.LogError(dbEx, "Database error while saving channel with name {Name}. Inner exception: {InnerException}", name, dbEx.InnerException?.Message);
                throw new Exception($"Ошибка при сохранении канала: {dbEx.InnerException?.Message ?? dbEx.Message}", dbEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating channel with name {Name} by owner {OwnerId}", name, ownerId);
                throw new Exception($"Ошибка при создании канала: {ex.Message}", ex);
            }
        }

        private async Task<long> GenerateUniquePublicIdAsync()
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var maxPublicId = await _context.Channels.MaxAsync(c => (long?)c.PublicId) ?? 0;
                var newPublicId = maxPublicId + 1;
                await transaction.CommitAsync();
                return newPublicId;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task DeleteChannelAsync(Guid channelId)
        {
            _logger.LogInformation("Deleting channel {ChannelId}", channelId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                var channel = await _channelRepository.GetChannelByIdWithMessagesAsync(channelId);
                if (channel == null)
                {
                    _logger.LogWarning("Channel with ID {ChannelId} not found", channelId);
                    throw new KeyNotFoundException($"Канал с ID {channelId} не найден");
                }

                if (channel.OwnerId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to delete channel {ChannelId}", currentUserId, channelId);
                    throw new UnauthorizedAccessException("Недостаточно прав для удаления канала");
                }

                var messages = await _context.Messages
                    .Where(m => m.ChannelId == channelId)
                    .ToListAsync();
                if (messages.Any())
                {
                    _context.Messages.RemoveRange(messages);
                }

                await _channelMembersRepository.DeleteByChannelIdAsync(channelId);
                await _notificationService.DeleteNotificationsByChannelIdAsync(channelId);
                await _channelRepository.DeleteChannelAsync(channelId);

                await _context.SaveChangesAsync();
                _logger.LogInformation("Channel {ChannelId} deleted successfully", channelId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting channel {ChannelId}", channelId);
                throw new Exception($"Ошибка при удалении канала: {ex.Message}", ex);
            }
        }

        public async Task<ChannelDto> ToggleFavoriteChannelAsync(Guid channelId, Guid userId, bool favorite)
        {
            _logger.LogInformation("Toggling favorite status for channel {ChannelId} for user {UserId} to {Favorite}", channelId, userId, favorite);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (userId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to toggle favorite for user {UserId}", currentUserId, userId);
                    throw new UnauthorizedAccessException("Недостаточно прав для изменения статуса избранного от имени другого пользователя");
                }

                var channel = await _channelRepository.GetChannelByIdWithMessagesAsync(channelId);
                if (channel == null)
                {
                    _logger.LogWarning("Channel with ID {ChannelId} not found", channelId);
                    throw new KeyNotFoundException($"Канал с ID {channelId} не найден");
                }

                var channelMember = await _channelMembersRepository.GetByChannelAndUserIdAsync(channelId, userId);
                if (channelMember == null)
                {
                    _logger.LogWarning("User {UserId} is not a member of channel {ChannelId}", userId, channelId);
                    throw new KeyNotFoundException($"Пользователь не является участником канала {channelId}");
                }

                channelMember.IsFavorite = favorite;
                await _channelMembersRepository.UpdateAsync(channelMember);

                var lastMessage = await _context.Messages
                    .Where(m => m.ChannelId == channelId)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new ChannelMessageDto
                        {
                            Id = m.Id,
                            ChannelId = m.ChannelId,
                            SenderId = m.SenderId,
                            Comment = m.Comment,
                            CreatedAt = m.CreatedAt,
                            Username = u.Username,
                            AvatarImageId = u.AvatarImageId
                        })
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();


                _logger.LogInformation("Favorite status for channel {ChannelId} updated to {Favorite} for user {UserId}", channelId, favorite, userId);

                return new ChannelDto
                {
                    Id = channel.Id,
                    PublicId = channel.PublicId,
                    OwnerId = channel.OwnerId,
                    Name = channel.Name,
                    IsPublic = channel.IsPublic,
                    ChannelTag = channel.ChannelTag,
                    Description = channel.Description,
                    AvatarImageId = channel.AvatarImageId,
                    AvatarImage = channel.AvatarImage,
                    CreatedAt = channel.CreatedAt,
                    IsActive = channel.IsActive,
                    MembersNumber = channel.MembersNumber,
                    IsFavorite = channelMember.IsFavorite,
                    LastMessageAt = lastMessage?.CreatedAt,
                    LastMessage = lastMessage
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling favorite for channel {ChannelId} for user {UserId}", channelId, userId);
                throw new Exception($"Ошибка при изменении статуса избранного для канала: {ex.Message}", ex);
            }
        }

        public async Task<ChannelMessageDto> SendChannelMessageAsync(Guid channelId, Guid senderId, string comment)
        {
            _logger.LogInformation("Sending message to channel {ChannelId} by user {SenderId}", channelId, senderId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (senderId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to send message as user {SenderId}", currentUserId, senderId);
                    throw new UnauthorizedAccessException("Недостаточно прав для отправки сообщения от имени другого пользователя");
                }

                var channelMember = await _channelMembersRepository.GetByChannelAndUserIdAsync(channelId, senderId);
                if (channelMember == null)
                {
                    _logger.LogWarning("User {SenderId} is not a member of channel {ChannelId}", senderId, channelId);
                    throw new UnauthorizedAccessException("Пользователь не является участником канала");
                }
                if (channelMember.Role != ChannelRole.Owner && channelMember.Role != ChannelRole.Moderator)
                {
                    _logger.LogWarning("User {SenderId} is not authorized to send message to channel {ChannelId}", senderId, channelId);
                    throw new UnauthorizedAccessException("Только владелец или модератор могут отправлять сообщения в канал");
                }

                var message = new Message
                {
                    Id = Guid.NewGuid(),
                    ChannelId = channelId,
                    SenderId = senderId,
                    Comment = comment,
                    CreatedAt = DateTime.UtcNow
                };

                await _messageRepository.AddAsync(message);
                var sender = await _userRepository.GetByIdAsync(senderId);
                var messageDto = new ChannelMessageDto
                {
                    Id = message.Id,
                    ChannelId = message.ChannelId,
                    SenderId = message.SenderId,
                    Comment = message.Comment,
                    CreatedAt = message.CreatedAt,
                    Username = sender?.Username ?? string.Empty,
                    AvatarImageId = sender?.AvatarImageId
                };

                await _hubContext.Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", messageDto);
                _logger.LogInformation("Message sent to channel {ChannelId} by user {SenderId}", channelId, senderId);

                return messageDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message to channel {ChannelId} by user {SenderId}", channelId, senderId);
                throw new Exception($"Ошибка при отправке сообщения в канал: {ex.Message}", ex);
            }
        }
    }
}