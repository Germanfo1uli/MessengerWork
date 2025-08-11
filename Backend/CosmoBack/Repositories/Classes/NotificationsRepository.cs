using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class NotificationsRepository(CosmoDbContext context) : Repository<Notification>(context), INotificationsRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<IEnumerable<Notification>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.Set<Notification>()
                .Where(n => n.UserId == userId)
                .Include(n => n.Chat)
                .Include(n => n.Group)
                .Include(n => n.Channel)
                .ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetAllByChatIdAsync(Guid chatId)
        {
            return await _context.Set<Notification>()
                .Where(n => n.ChatId == chatId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetAllByGroupIdAsync(Guid groupId)
        {
            return await _context.Set<Notification>()
                .Where(n => n.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetAllByChannelIdAsync(Guid channelId)
        {
            return await _context.Notifications
                .Where(n => n.ChannelId == channelId)
                .ToListAsync();
        }

        public override async Task AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }
    }
}