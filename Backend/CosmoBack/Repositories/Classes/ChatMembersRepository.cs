using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace CosmoBack.Repositories.Classes
{
    public class ChatMembersRepository(CosmoDbContext context) : IChatMembersRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task AddAsync(ChatMember chatMember)
        {
            await _context.ChatMembers.AddAsync(chatMember);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByChatIdAsync(Guid chatId)
        {
            var members = await _context.ChatMembers
                .Where(cm => cm.ChatId == chatId)
                .ToListAsync();
            if (members.Any())
            {
                _context.ChatMembers.RemoveRange(members);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ChatMember> GetByChatAndUserIdAsync(Guid chatId, Guid userId)
        {
            return await _context.ChatMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(cm => cm.ChatId == chatId && cm.UserId == userId);
        }

        public async Task UpdateAsync(ChatMember chatMember)
        {
            _context.ChatMembers.Update(chatMember);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid chatMemberId)
        {
            var chatMember = await _context.ChatMembers.FindAsync(chatMemberId);
            if (chatMember != null)
            {
                _context.ChatMembers.Remove(chatMember);
                await _context.SaveChangesAsync();
            }
        }
    }
}