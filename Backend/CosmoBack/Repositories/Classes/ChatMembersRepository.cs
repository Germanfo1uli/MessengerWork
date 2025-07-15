using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ChatMembersRepository(CosmoDbContext context) : Repository<ChatMember>(context), IChatMembersRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<ChatMember> GetByChatAndUserIdAsync(Guid chatId, Guid userId)
        {
            return await _context.Set<ChatMember>()
                .FirstOrDefaultAsync(cm => cm.ChatId == chatId && cm.UserId == userId);
        }

        public async Task DeleteByChatIdAsync(Guid chatId)
        {
            var members = await _context.Set<ChatMember>()
                .Where(cm => cm.ChatId == chatId)
                .ToListAsync();
            _context.Set<ChatMember>().RemoveRange(members);
            await _context.SaveChangesAsync();
        }
    }
}