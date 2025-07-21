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

                if (!tag.StartsWith('@'))
                {
                    var users = await _context.Users
                        .Where(u => (u.PublicName != null && u.PublicName.Contains(normalizedTag)) ||
                                   (u.Username.Contains(normalizedTag)))
                        .Select(u => new TagSearchDto
                        {
                            Id = u.Id,
                            Tag = u.PublicName ?? u.Username, 
                            Type = EntityType.User,
                            CreatedAt = u.CreatedAt,
                            AvatarImageId = u.AvatarImageId,
                            Username = u.Username,
                            OnlineStatus = u.OnlineStatus,
                            Phone = u.Phone,
                            Bio = u.Bio
                        })
                        .ToListAsync();

                    results.AddRange(users);
                }

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
                        AvatarImageId = c.AvatarImageId,
                        MembersCount = c.MembersNumber
                    })
                    .ToListAsync();

                results.AddRange(channels);

                var groups = await _context.Groups
                    .Where(g => g.GroupTag != null && g.GroupTag.Contains(normalizedTag))
                    .Select(g => new TagSearchDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Description = g.Description,
                        Tag = g.GroupTag,
                        Type = EntityType.Group,
                        CreatedAt = g.CreatedAt,
                        AvatarImageId = g.AvatarImageId,
                        MembersCount = _context.GroupMembers.Count(gm => gm.GroupId == g.Id)
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
                            Name = u.PublicName ?? u.Username,
                            Tag = c.ContactTag,
                            Type = EntityType.Contact,
                            CreatedAt = c.CreatedAt,
                            AvatarImageId = u.AvatarImageId,
                            Username = u.Username,
                            OnlineStatus = u.OnlineStatus,
                            ContactTag = c.ContactTag
                        })
                    .ToListAsync();

                results.AddRange(contacts);

                var chatMatches = await _context.Chats
                    .Where(c => c.FirstUserId == userId || c.SecondUserId == userId)
                    .Join(_context.Contacts,
                        c => c.FirstUserId == userId ? c.SecondUserId : c.FirstUserId,
                        contact => contact.ContactId,
                        (c, contact) => new { Chat = c, Contact = contact })
                    .Where(x => x.Contact.OwnerId == userId &&
                               x.Contact.ContactTag != null &&
                               x.Contact.ContactTag.Contains(normalizedTag))
                    .Join(_context.Users,
                        x => x.Contact.ContactId,
                        u => u.Id,
                        (x, u) => new TagSearchDto
                        {
                            Id = x.Chat.Id,
                            PublicId = x.Chat.PublicId,
                            Name = u.PublicName ?? u.Username,
                            Tag = x.Contact.ContactTag,
                            Type = EntityType.Chat,
                            CreatedAt = x.Chat.CreatedAt,
                            AvatarImageId = u.AvatarImageId,
                            Username = u.Username,
                            OnlineStatus = u.OnlineStatus,
                            ContactTag = x.Contact.ContactTag
                        })
                    .ToListAsync();

                results.AddRange(chatMatches);

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
                            var chatLastMessage = await _context.Messages
                                .Where(m => m.ChatId == result.Id)
                                .OrderByDescending(m => m.CreatedAt)
                                .FirstOrDefaultAsync();

                            result.LastMessage = chatLastMessage?.Comment;
                            result.LastMessageAt = chatLastMessage?.CreatedAt;

                            var chatMember = await _context.ChatMembers
                                .FirstOrDefaultAsync(cm => cm.ChatId == result.Id && cm.UserId == userId);

                            result.IsFavorite = chatMember?.IsFavorite;
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