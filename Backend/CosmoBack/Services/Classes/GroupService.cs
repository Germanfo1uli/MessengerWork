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
    public class GroupService(
        IGroupRepository groupRepository,
        IMessageRepository messageRepository,
        IUserRepository userRepository,
        IGroupMembersRepository groupMembersRepository,
        INotificationService notificationService,
        CosmoDbContext context,
        ILogger<GroupService> logger,
        IHubContext<ChatHub> hubContext) : IGroupService
    {
        private readonly IGroupRepository _groupRepository = groupRepository;
        private readonly IMessageRepository _messageRepository = messageRepository;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IGroupMembersRepository _groupMembersRepository = groupMembersRepository;
        private readonly INotificationService _notificationService = notificationService;
        private readonly CosmoDbContext _context = context;
        private readonly ILogger<GroupService> _logger = logger;
        private readonly IHubContext<ChatHub> _hubContext = hubContext;

        public async Task<GroupDto> GetGroupByIdAsync(Guid id)
        {
            _logger.LogInformation("Getting group with ID {GroupId}", id);
            try
            {
                var group = await _groupRepository.GetGroupByIdWithMessagesAsync(id);
                if (group == null)
                {
                    _logger.LogWarning("Group with ID {GroupId} not found", id);
                    throw new KeyNotFoundException($"Группа с ID {id} не найдена");
                }

                var userId = Guid.Parse(System.Threading.Thread.CurrentPrincipal?.Identity?.Name
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                var groupMember = await _groupMembersRepository.GetByGroupAndUserIdAsync(id, userId);

                var lastMessage = await _context.Messages
                    .Where(m => m.GroupId == id)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new GroupMessageDto
                        {
                            Id = m.Id,
                            GroupId = m.GroupId,
                            SenderId = m.SenderId,
                            Comment = m.Comment,
                            CreatedAt = m.CreatedAt,
                            Username = u.Username,
                            AvatarImageId = u.AvatarImageId
                        })
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();

                return new GroupDto
                {
                    Id = group.Id,
                    PublicId = group.PublicId,
                    OwnerId = group.OwnerId,
                    Name = group.Name,
                    IsPublic = group.IsPublic,
                    GroupTag = group.GroupTag,
                    Description = group.Description,
                    AvatarImageId = group.AvatarImageId,
                    CreatedAt = group.CreatedAt,
                    IsActive = group.IsActive,
                    IsFavorite = groupMember?.IsFavorite ?? false,
                    LastMessageAt = lastMessage?.CreatedAt,
                    LastMessage = lastMessage
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving group with ID {GroupId}", id);
                throw new Exception($"Ошибка при получении группы: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<GroupDto>> GetUserGroupsAsync(Guid userId)
        {
            _logger.LogInformation("Getting groups for user {UserId}", userId);
            try
            {
                var groups = await _groupRepository.GetGroupsByUserIdAsync(userId);
                var groupDtos = new List<GroupDto>();

                foreach (var group in groups)
                {
                    var groupMember = await _groupMembersRepository.GetByGroupAndUserIdAsync(group.Id, userId);
                    var lastMessage = await _context.Messages
                        .Where(m => m.GroupId == group.Id)
                        .Join(_context.Users,
                            m => m.SenderId,
                            u => u.Id,
                            (m, u) => new GroupMessageDto
                            {
                                Id = m.Id,
                                GroupId = m.GroupId,
                                SenderId = m.SenderId,
                                Comment = m.Comment,
                                CreatedAt = m.CreatedAt,
                                Username = u.Username,
                                AvatarImageId = u.AvatarImageId
                            })
                        .OrderByDescending(m => m.CreatedAt)
                        .FirstOrDefaultAsync();

                    groupDtos.Add(new GroupDto
                    {
                        Id = group.Id,
                        PublicId = group.PublicId,
                        OwnerId = group.OwnerId,
                        Name = group.Name,
                        IsPublic = group.IsPublic,
                        GroupTag = group.GroupTag,
                        Description = group.Description,
                        AvatarImageId = group.AvatarImageId,
                        CreatedAt = group.CreatedAt,
                        IsActive = group.IsActive,
                        IsFavorite = groupMember?.IsFavorite ?? false,
                        LastMessageAt = lastMessage?.CreatedAt,
                        LastMessage = lastMessage
                    });
                }

                _logger.LogInformation("Retrieved {GroupCount} groups for user {UserId}", groupDtos.Count, userId);
                return groupDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving groups for user {UserId}", userId);
                throw new Exception($"Ошибка при получении групп пользователя: {ex.Message}", ex);
            }
        }

        public async Task<GroupDto> CreateGroupAsync(Guid ownerId, string name, bool isPublic, string? groupTag, string? description, Guid? avatarImageId)
        {
            _logger.LogInformation("Creating group with name {Name} by owner {OwnerId}", name, ownerId);
            try
            {
                var owner = await _userRepository.GetByIdAsync(ownerId);
                if (owner == null)
                {
                    _logger.LogWarning("Owner {OwnerId} not found", ownerId);
                    throw new KeyNotFoundException("Владелец группы не найден");
                }

                if (await _groupRepository.GroupExistsAsync(name, ownerId))
                {
                    _logger.LogWarning("Group with name {Name} already exists for owner {OwnerId}", name, ownerId);
                    throw new InvalidOperationException("Группа с таким названием уже существует");
                }

                var group = new Group
                {
                    Id = Guid.NewGuid(),
                    OwnerId = ownerId,
                    Name = name,
                    IsPublic = isPublic,
                    GroupTag = groupTag,
                    Description = description,
                    AvatarImageId = avatarImageId,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await _groupRepository.CreateGroupAsync(group);

                var groupMember = new GroupMember
                {
                    Id = Guid.NewGuid(),
                    GroupId = group.Id,
                    UserId = ownerId,
                    Role = GroupRole.Owner,
                    Notifications = true,
                    IsFavorite = false // По умолчанию не избранное
                };

                await _groupMembersRepository.AddAsync(groupMember);

                var notification = new Notification
                {
                    Id = Guid.NewGuid(),
                    UserId = ownerId,
                    GroupId = group.Id,
                    ChatId = null,
                    ChannelId = null,
                    IsEnabled = true
                };

                await _notificationService.CreateNotificationAsync(notification);

                _logger.LogInformation("Group {GroupId} created successfully with owner {OwnerId}", group.Id, ownerId);

                return new GroupDto
                {
                    Id = group.Id,
                    PublicId = group.PublicId,
                    OwnerId = group.OwnerId,
                    Name = group.Name,
                    IsPublic = group.IsPublic,
                    GroupTag = group.GroupTag,
                    Description = group.Description,
                    AvatarImageId = group.AvatarImageId,
                    CreatedAt = group.CreatedAt,
                    IsActive = group.IsActive,
                    IsFavorite = false,
                    LastMessageAt = null,
                    LastMessage = null
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating group with name {Name} by owner {OwnerId}", name, ownerId);
                throw new Exception($"Ошибка при создании группы: {ex.Message}", ex);
            }
        }

        public async Task DeleteGroupAsync(Guid groupId)
        {
            _logger.LogInformation("Deleting group {GroupId}", groupId);
            try
            {
                var group = await _groupRepository.GetGroupByIdWithMessagesAsync(groupId);
                if (group == null)
                {
                    _logger.LogWarning("Group with ID {GroupId} not found", groupId);
                    throw new KeyNotFoundException($"Группа с ID {groupId} не найдена");
                }

                var messages = await _context.Messages
                    .Where(m => m.GroupId == groupId)
                    .ToListAsync();
                if (messages.Any())
                {
                    _context.Messages.RemoveRange(messages);
                }

                await _groupMembersRepository.DeleteByGroupIdAsync(groupId);
                await _notificationService.DeleteNotificationsByGroupIdAsync(groupId);
                await _groupRepository.DeleteGroupAsync(groupId);

                await _context.SaveChangesAsync();
                _logger.LogInformation("Group {GroupId} deleted successfully", groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting group {GroupId}", groupId);
                throw new Exception($"Ошибка при удалении группы: {ex.Message}", ex);
            }
        }

        public async Task<GroupMessageDto> SendMessageAsync(Guid groupId, Guid senderId, string content)
        {
            _logger.LogInformation("Sending message in group {GroupId} by user {SenderId}", groupId, senderId);
            try
            {
                var group = await _groupRepository.GetGroupByIdWithMessagesAsync(groupId);
                if (group == null)
                {
                    _logger.LogWarning("Group with ID {GroupId} not found", groupId);
                    throw new KeyNotFoundException($"Группа с ID {groupId} не найдена");
                }

                var isMember = group.Members.Any(m => m.UserId == senderId);
                if (!isMember)
                {
                    _logger.LogWarning("Sender {SenderId} is not a member of group {GroupId}", senderId, groupId);
                    throw new UnauthorizedAccessException("Отправитель не является участником группы");
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
                    GroupId = groupId,
                    SenderId = senderId,
                    Comment = content,
                    CreatedAt = DateTime.UtcNow
                };

                await _messageRepository.AddAsync(message);
                _logger.LogInformation("Message {MessageId} sent in group {GroupId} by user {SenderId}", message.Id, groupId, senderId);

                var messageDto = new GroupMessageDto
                {
                    Id = message.Id,
                    GroupId = message.GroupId,
                    SenderId = message.SenderId,
                    Comment = message.Comment,
                    CreatedAt = message.CreatedAt,
                    Username = sender.Username,
                    AvatarImageId = sender.AvatarImageId
                };

                await _hubContext.Clients.Group(groupId.ToString()).SendAsync("ReceiveMessage", messageDto);

                return messageDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message in group {GroupId} by user {SenderId}", groupId, senderId);
                throw new Exception($"Ошибка при отправке сообщения: {ex.Message}", ex);
            }
        }

        public async Task<GroupDto> ToggleFavoriteGroupAsync(Guid groupId, Guid userId, bool favorite)
        {
            _logger.LogInformation("Toggling favorite status for group {GroupId} for user {UserId} to {Favorite}", groupId, userId, favorite);
            try
            {
                var group = await _groupRepository.GetGroupByIdWithMessagesAsync(groupId);
                if (group == null)
                {
                    _logger.LogWarning("Group with ID {GroupId} not found", groupId);
                    throw new KeyNotFoundException($"Группа с ID {groupId} не найдена");
                }

                var groupMember = await _groupMembersRepository.GetByGroupAndUserIdAsync(groupId, userId);
                if (groupMember == null)
                {
                    _logger.LogWarning("User {UserId} is not a member of group {GroupId}", userId, groupId);
                    throw new KeyNotFoundException($"Пользователь не является участником группы {groupId}");
                }

                groupMember.IsFavorite = favorite;
                await _context.SaveChangesAsync();

                var lastMessage = await _context.Messages
                    .Where(m => m.GroupId == groupId)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new GroupMessageDto
                        {
                            Id = m.Id,
                            GroupId = m.GroupId,
                            SenderId = m.SenderId,
                            Comment = m.Comment,
                            CreatedAt = m.CreatedAt,
                            Username = u.Username,
                            AvatarImageId = u.AvatarImageId
                        })
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync();

                _logger.LogInformation("Favorite status for group {GroupId} updated to {Favorite} for user {UserId}", groupId, favorite, userId);

                return new GroupDto
                {
                    Id = group.Id,
                    PublicId = group.PublicId,
                    OwnerId = group.OwnerId,
                    Name = group.Name,
                    IsPublic = group.IsPublic,
                    GroupTag = group.GroupTag,
                    Description = group.Description,
                    AvatarImageId = group.AvatarImageId,
                    CreatedAt = group.CreatedAt,
                    IsActive = group.IsActive,
                    IsFavorite = groupMember.IsFavorite,
                    LastMessageAt = lastMessage?.CreatedAt,
                    LastMessage = lastMessage
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling favorite status for group {GroupId} for user {UserId}", groupId, userId);
                throw new Exception($"Ошибка при изменении статуса избранного для группы: {ex.Message}", ex);
            }
        }
    }
}