using CosmoBack.CosmoDBContext;
using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Services.Classes
{
    public class TagSearchService : ITagSearchService
    {
        private readonly CosmoDbContext _context;
        private readonly ILogger<TagSearchService> _logger;

        public TagSearchService(
            CosmoDbContext context,
            ILogger<TagSearchService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<TagSearchDto>> SearchByTagAsync(Guid userId, string tag)
        {
            _logger.LogInformation("Searching for entities with tag '{Tag}' for user {UserId}", tag, userId);

            try
            {
                var normalizedTag = tag.StartsWith('@') ? tag[1..] : tag;
                var results = new List<TagSearchDto>();

                // Always search for users, but include additional fields when tag doesn't start with '@'
                var users = await _context.Users
                    .Where(u => (u.PublicName != null && u.PublicName.Contains(normalizedTag)) ||
                               (u.Username.Contains(normalizedTag)))
                    .Select(u => new TagSearchDto
                    {
                        Id = u.Id,
                        PublicId = null, // Not available for users in this context
                        Name = u.PublicName ?? u.Username,
                        Description = null, // Not available for users
                        Tag = u.PublicName ?? u.Username,
                        Type = EntityType.User,
                        CreatedAt = u.CreatedAt,
                        LastMessageAt = null, // Will be updated below if needed
                        LastMessage = null, // Will be updated below if needed
                        AvatarImageId = u.AvatarImageId,
                        MembersCount = null, // Not applicable for users
                        IsFavorite = null, // Will be updated below if needed
                        Username = u.Username,
                        OnlineStatus = u.OnlineStatus,
                        ContactTag = null, // Will be updated for contacts
                        Phone = u.Phone,
                        Bio = u.Bio
                    })
                    .ToListAsync();

                results.AddRange(users);

                var channels = await _context.Channels
                    .Where(c => c.ChannelTag != null && c.ChannelTag.Contains(normalizedTag))
                    .Select(c => new TagSearchDto
                    {
                        Id = c.Id,
                        PublicId = c.PublicId,
                        Name = c.Name,
                        Description = c.Description,
                        Tag = c.ChannelTag,
                        Type = EntityType.Channel,
                        CreatedAt = c.CreatedAt,
                        LastMessageAt = null, // Will be updated below
                        LastMessage = null, // Will be updated below
                        AvatarImageId = c.AvatarImageId,
                        MembersCount = c.MembersNumber,
                        IsFavorite = null, // Will be updated below
                        Username = null, // Not applicable for channels
                        OnlineStatus = null, // Not applicable for channels
                        ContactTag = null, // Not applicable for channels
                        Phone = null, // Not applicable for channels
                        Bio = null // Not applicable for channels
                    })
                    .ToListAsync();

                results.AddRange(channels);

                var groups = await _context.Groups
                    .Where(g => g.GroupTag != null && g.GroupTag.Contains(normalizedTag))
                    .Select(g => new TagSearchDto
                    {
                        Id = g.Id,
                        PublicId = null, // Not available for groups in this context
                        Name = g.Name,
                        Description = g.Description,
                        Tag = g.GroupTag,
                        Type = EntityType.Group,
                        CreatedAt = g.CreatedAt,
                        LastMessageAt = null, // Will be updated below
                        LastMessage = null, // Will be updated below
                        AvatarImageId = g.AvatarImageId,
                        MembersCount = _context.GroupMembers.Count(gm => gm.GroupId == g.Id),
                        IsFavorite = null, // Will be updated below
                        Username = null, // Not applicable for groups
                        OnlineStatus = null, // Not applicable for groups
                        ContactTag = null, // Not applicable for groups
                        Phone = null, // Not applicable for groups
                        Bio = null // Not applicable for groups
                    })
                    .ToListAsync();

                results.AddRange(groups);

                var contacts = await _context.Contacts
                    .Where(c => c.ContactTag != null && c.ContactTag.Contains(normalizedTag) && c.OwnerId == userId)
                    .Join(_context.Users,
                        c => c.ContactId,
                        u => u.Id,
                        (c, u) => new TagSearchDto
                        {
                            Id = u.Id,
                            PublicId = null, // Not available for contacts in this context
                            Name = u.PublicName ?? u.Username,
                            Description = null, // Not available for contacts
                            Tag = c.ContactTag,
                            Type = EntityType.Contact,
                            CreatedAt = c.CreatedAt,
                            LastMessageAt = null, // Will be updated below if needed
                            LastMessage = null, // Will be updated below if needed
                            AvatarImageId = u.AvatarImageId,
                            MembersCount = null, // Not applicable for contacts
                            IsFavorite = null, // Will be updated below if needed
                            Username = u.Username,
                            OnlineStatus = u.OnlineStatus,
                            ContactTag = c.ContactTag,
                            Phone = u.Phone,
                            Bio = u.Bio
                        })
                    .ToListAsync();

                results.AddRange(contacts);

                // Update last messages and favorite status for all results
                foreach (var result in results)
                {
                    switch (result.Type)
                    {
                        case EntityType.Channel:
                            var channelLastMessage = await _context.Messages
                                .Where(m => m.ChannelId == result.Id)
                                .OrderByDescending(m => m.CreatedAt)
                                .FirstOrDefaultAsync();

                            result.LastMessage = channelLastMessage?.Comment;
                            result.LastMessageAt = channelLastMessage?.CreatedAt;

                            var channelMember = await _context.ChannelMembers
                                .FirstOrDefaultAsync(cm => cm.ChannelId == result.Id && cm.UserId == userId);

                            result.IsFavorite = channelMember?.IsFavorite;
                            break;

                        case EntityType.Chat:
                            // Find existing chat between current user and the found user
                            var chat = await _context.Chats
                                .FirstOrDefaultAsync(c =>
                                    (c.FirstUserId == userId && c.SecondUserId == result.Id) ||
                                    (c.FirstUserId == result.Id && c.SecondUserId == userId));

                            if (chat != null)
                            {
                                result.Id = chat.Id; // Override with chat ID for chat type
                                result.PublicId = chat.PublicId;

                                var chatLastMessage = await _context.Messages
                                    .Where(m => m.ChatId == chat.Id)
                                    .OrderByDescending(m => m.CreatedAt)
                                    .FirstOrDefaultAsync();

                                result.LastMessage = chatLastMessage?.Comment;
                                result.LastMessageAt = chatLastMessage?.CreatedAt;

                                var chatMember = await _context.ChatMembers
                                    .FirstOrDefaultAsync(cm => cm.ChatId == chat.Id && cm.UserId == userId);

                                result.IsFavorite = chatMember?.IsFavorite;
                            }
                            break;

                        case EntityType.Group:
                            var groupLastMessage = await _context.Messages
                                .Where(m => m.GroupId == result.Id)
                                .OrderByDescending(m => m.CreatedAt)
                                .FirstOrDefaultAsync();

                            result.LastMessage = groupLastMessage?.Comment;
                            result.LastMessageAt = groupLastMessage?.CreatedAt;

                            var groupMember = await _context.GroupMembers
                                .FirstOrDefaultAsync(gm => gm.GroupId == result.Id && gm.UserId == userId);

                            result.IsFavorite = groupMember?.IsFavorite;
                            break;

                        case EntityType.User:
                        case EntityType.Contact:
                            // For users and contacts, check if there's an existing chat
                            var userChat = await _context.Chats
                                .FirstOrDefaultAsync(c =>
                                    (c.FirstUserId == userId && c.SecondUserId == result.Id) ||
                                    (c.FirstUserId == result.Id && c.SecondUserId == userId));

                            if (userChat != null)
                            {
                                result.LastMessageAt = await _context.Messages
                                    .Where(m => m.ChatId == userChat.Id)
                                    .OrderByDescending(m => m.CreatedAt)
                                    .Select(m => m.CreatedAt)
                                    .FirstOrDefaultAsync();

                                result.LastMessage = await _context.Messages
                                    .Where(m => m.ChatId == userChat.Id)
                                    .OrderByDescending(m => m.CreatedAt)
                                    .Select(m => m.Comment)
                                    .FirstOrDefaultAsync();

                                var userChatMember = await _context.ChatMembers
                                    .FirstOrDefaultAsync(cm => cm.ChatId == userChat.Id && cm.UserId == userId);

                                result.IsFavorite = userChatMember?.IsFavorite;
                            }
                            break;
                    }
                }

                // Сортировка по релевантности
                return results
                    .OrderByDescending(r => r.Tag?.StartsWith(normalizedTag) ?? false)
                    .ThenByDescending(r => r.Tag?.Contains(normalizedTag) ?? false)
                    .ThenByDescending(r => r.LastMessageAt ?? r.CreatedAt)
                    .Take(10);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching by tag '{Tag}' for user {UserId}", tag, userId);
                throw;
            }
        }
    }
}