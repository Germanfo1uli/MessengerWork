using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ChatMembersRepository(CosmoDbContext context) : Repository<ChatMember>(context), IChatMembersRepository
    {
        public async Task<ChatMember> GetByChatAndUserIdAsync(Guid chatId, Guid userId)
        {
            return await _context.Set<ChatMember>()
                .FirstOrDefaultAsync(cm => cm.ChatId == chatId && cm.UserId == userId);
        }

        public async Task<ChatMember> GetNotificationStatusAsync(Guid chatId, Guid userId)
        {
            return await _context.Set<ChatMember>()
                .FirstOrDefaultAsync(cm => cm.ChatId == chatId && cm.UserId == userId);
        }
    }
}