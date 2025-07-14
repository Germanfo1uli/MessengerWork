using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ChatRepository(CosmoDbContext context) : Repository<Chat>(context), IChatRepository
    {
        public async Task<IEnumerable<Chat>> GetChatsByUserIdAsync(Guid userId)
        {
            return await _context.Set<Chat>()
                .Where(c => c.FirstUserId == userId || c.SecondUserId == userId)
                .Include(c => c.FirstUser)
                .Include(c => c.SecondUser)
                .Include(c => c.Messages)
                .ToListAsync();
        }
    }
}