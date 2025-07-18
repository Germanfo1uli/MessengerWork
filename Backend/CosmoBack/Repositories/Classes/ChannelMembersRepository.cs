using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ChannelMembersRepository(CosmoDbContext context) : IChannelMembersRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task AddAsync(ChannelMember channelMember)
        {
            await _context.ChannelMembers.AddAsync(channelMember);
        }

        public async Task DeleteByChannelIdAsync(Guid channelId)
        {
            var members = await _context.ChannelMembers
                .Where(cm => cm.ChannelId == channelId)
                .ToListAsync();
            if (members.Any())
            {
                _context.ChannelMembers.RemoveRange(members);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteByChannelIdAndUserIdAsync(Guid channelId, Guid userId)
        {
            var member = await _context.ChannelMembers
                .FirstOrDefaultAsync(cm => cm.ChannelId == channelId && cm.UserId == userId);
            if (member != null)
            {
                _context.ChannelMembers.Remove(member);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ChannelMember> GetByChannelAndUserIdAsync(Guid channelId, Guid userId)
        {
            return await _context.ChannelMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(cm => cm.ChannelId == channelId && cm.UserId == userId);
        }

        public async Task UpdateAsync(ChannelMember channelMember)
        {
            _context.Update(channelMember);
            await _context.SaveChangesAsync();
        }
    }
}