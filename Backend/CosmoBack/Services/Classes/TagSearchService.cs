using CosmoBack.CosmoDBContext;
using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Services.Classes
{
    public class TagSearchService(
        CosmoDbContext context,
        ILogger<TagSearchService> logger) : ITagSearchService
    {
        private readonly CosmoDbContext _context = context;
        private readonly ILogger<TagSearchService> _logger = logger;

        public async Task<IEnumerable<TagSearchDto>> SearchByTagAsync(Guid userId, string tag)
        {
            _logger.LogInformation("Searching for entities with tag '{Tag}' for user {UserId}", tag, userId);

            try
            {
                var normalizedTag = tag.StartsWith('@') ? tag[1..] : tag;
                var results = new List<TagSearchDto>();

                var users = await _context.Users
                    .Where(u => (u.PublicName != null && u.PublicName.Contains(normalizedTag)) ||
                               (u.Username.Contains(normalizedTag)))
                    .Select(u => new TagSearchDto
                    {
                        Id = u.Id,
                        PublicId = null, 
                        Name = u.PublicName ?? u.Username,
                        Description = null,
                        Tag = u.PublicName ?? u.Username,
                        Type = EntityType.User,
                        CreatedAt = u.CreatedAt,
                        LastMessageAt = null,
                        LastMessage = null,
                        AvatarImageId = u.AvatarImageId,
                        MembersCount = null,
                        IsFavorite = null, 
                        Username = u.Username,
                        OnlineStatus = u.OnlineStatus,
                        ContactTag = null, 
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
                        LastMessageAt = null, 
                        LastMessage = null,
                        AvatarImageId = c.AvatarImageId,
                        MembersCount = c.MembersNumber,
                        IsFavorite = null, 
                        Username = null, 
                        OnlineStatus = null, 
                        ContactTag = null,
                        Phone = null,
                        Bio = null
                    })
                    .ToListAsync();

                results.AddRange(channels);

                var groups = await _context.Groups
                    .Where(g => g.GroupTag != null && g.GroupTag.Contains(normalizedTag))
                    .Select(g => new TagSearchDto
                    {
                        Id = g.Id,
                        PublicId = null,
                        Name = g.Name,
                        Description = g.Description,
                        Tag = g.GroupTag,
                        Type = EntityType.Group,
                        CreatedAt = g.CreatedAt,
                        LastMessageAt = null, 
                        LastMessage = null,
                        AvatarImageId = g.AvatarImageId,
                        MembersCount = _context.GroupMembers.Count(gm => gm.GroupId == g.Id),
                        IsFavorite = null, 
                        Username = null, 
                        OnlineStatus = null, 
                        ContactTag = null,
                        Phone = null, 
                        Bio = null 
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
                            PublicId = null, 
                            Name = u.PublicName ?? u.Username,
                            Description = null, 
                            Tag = c.ContactTag,
                            Type = EntityType.Contact,
                            CreatedAt = c.CreatedAt,
                            LastMessageAt = null, 
                            LastMessage = null,
                            AvatarImageId = u.AvatarImageId,
                            MembersCount = null, 
                            IsFavorite = null, 
                            Username = u.Username,
                            OnlineStatus = u.OnlineStatus,
                            ContactTag = c.ContactTag,
                            Phone = u.Phone,
                            Bio = u.Bio
                        })
                    .ToListAsync();

                results.AddRange(contacts);

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
                            var chat = await _context.Chats
                                .FirstOrDefaultAsync(c =>
                                    (c.FirstUserId == userId && c.SecondUserId == result.Id) ||
                                    (c.FirstUserId == result.Id && c.SecondUserId == userId));

                            if (chat != null)
                            {
                                result.Id = chat.Id; 
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
                            var userChat = await _context.Chats
                                .FirstOrDefaultAsync(c =>
                                    (c.FirstUserId == userId && c.SecondUserId == result.Id) ||
                                    (c.FirstUserId == result.Id && c.SecondUserId == userId));

                            if (userChat != null)
                            {
                                result.Id = userChat.Id;
                                result.PublicId = userChat.PublicId;

                                var chatLastMessage = await _context.Messages
                                    .Where(m => m.ChatId == userChat.Id)
                                    .OrderByDescending(m => m.CreatedAt)
                                    .FirstOrDefaultAsync();

                                result.LastMessage = chatLastMessage?.Comment;
                                result.LastMessageAt = chatLastMessage?.CreatedAt;

                                var userChatMember = await _context.ChatMembers
                                    .FirstOrDefaultAsync(cm => cm.ChatId == userChat.Id && cm.UserId == userId);

                                result.IsFavorite = userChatMember?.IsFavorite;
                            }
                            break;
                    }
                }

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