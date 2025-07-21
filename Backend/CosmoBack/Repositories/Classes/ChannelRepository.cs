using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ChannelRepository(CosmoDbContext context) : IChannelRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<Channel> GetChannelByIdWithMessagesAsync(Guid id)
        {
            return await _context.Channels
                .Include(c => c.Messages)
                .Include(c => c.Members)
                .ThenInclude(cm => cm.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Channel>> GetChannelsByUserIdAsync(Guid userId)
        {
            return await _context.Channels
                .Include(c => c.Messages)
                .Include(c => c.Members)
                .ThenInclude(cm => cm.User)
                .Where(c => c.Members.Any(cm => cm.UserId == userId))
                .ToListAsync();
        }

        public async Task CreateChannelAsync(Channel channel)
        {
            await _context.Channels.AddAsync(channel);
        }

        public async Task DeleteChannelAsync(Guid id)
        {
            var channel = await _context.Channels.FindAsync(id);
            if (channel != null)
            {
                _context.Channels.Remove(channel);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ChannelExistsAsync(string name, Guid ownerId)
        {
            return await _context.Channels
                .AnyAsync(c => c.Name == name && c.OwnerId == ownerId);
        }
    }
}