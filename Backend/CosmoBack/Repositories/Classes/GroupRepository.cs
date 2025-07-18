using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace CosmoBack.Repositories.Classes
{
    public class GroupRepository(CosmoDbContext context) : Repository<Group>(context), IGroupRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<IEnumerable<Group>> GetGroupsByUserIdAsync(Guid userId)
        {
            return await _context.Groups
                .AsNoTracking()
                .Where(g => g.Members.Any(m => m.UserId == userId))
                .Include(g => g.Owner)
                .Include(g => g.Messages)
                .Include(g => g.Members)
                .ToListAsync();
        }

        public async Task<Group> GetGroupByIdWithMessagesAsync(Guid id)
        {
            return await _context.Groups
                .AsNoTracking()
                .Include(g => g.Messages)
                .Include(g => g.Members)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<bool> GroupExistsAsync(string name, Guid ownerId)
        {
            return await _context.Groups
                .AsNoTracking()
                .AnyAsync(g => g.Name == name && g.OwnerId == ownerId);
        }

        public async Task<Group> CreateGroupAsync(Group group)
        {
            group.PublicId = await GenerateUniquePublicIdAsync();
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();
            return group;
        }

        public async Task DeleteGroupAsync(Guid groupId)
        {
            var group = await _context.Groups.FindAsync(groupId);
            if (group != null)
            {
                _context.Groups.Remove(group);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<object>> GetGroupsWithDetailsAsync(Guid userId)
        {
            return await _context.Groups
                .AsNoTracking()
                .Where(g => g.Members.Any(m => m.UserId == userId))
                .Select(g => new
                {
                    Group = g,
                    LastMessageData = g.Messages
                        .Join(_context.Users,
                            m => m.SenderId,
                            u => u.Id,
                            (m, u) => new
                            {
                                Message = m,
                                Username = u.Username,
                                AvatarImageId = u.AvatarImageId
                            })
                        .OrderByDescending(m => m.Message.CreatedAt)
                        .FirstOrDefault(),
                    Owner = _context.Users
                        .Where(u => u.Id == g.OwnerId)
                        .Select(u => new
                        {
                            Username = u.Username,
                            OnlineStatus = u.OnlineStatus
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();
        }

        private async Task<long> GenerateUniquePublicIdAsync()
        {
            var random = new Random();
            long newId;
            do
            {
                newId = random.NextInt64(1, long.MaxValue);
            } while (await _context.Groups.AnyAsync(g => g.PublicId == newId));
            return newId;
        }
    }
}