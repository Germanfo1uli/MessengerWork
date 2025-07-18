using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class GroupMembersRepository : IGroupMembersRepository
    {
        private readonly CosmoDbContext _context;

        public GroupMembersRepository(CosmoDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(GroupMember groupMember)
        {
            await _context.GroupMembers.AddAsync(groupMember);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByGroupIdAsync(Guid groupId)
        {
            var members = await _context.GroupMembers
                .Where(gm => gm.GroupId == groupId)
                .ToListAsync();
            if (members.Any())
            {
                _context.GroupMembers.RemoveRange(members);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<GroupMember> GetByGroupAndUserIdAsync(Guid groupId, Guid userId)
        {
            return await _context.GroupMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == userId);
        }
    }
}