using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class NotificationsRepository(CosmoDbContext context) : Repository<Notification>(context), INotificationsRepository
    {
        public async Task<IEnumerable<Notification>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.Set<Notification>()
                .Where(n => n.UserId == userId)
                .Include(n => n.Chat)
                .Include(n => n.Group)
                .Include(n => n.Channel)
                .ToListAsync();
        }
    }
}