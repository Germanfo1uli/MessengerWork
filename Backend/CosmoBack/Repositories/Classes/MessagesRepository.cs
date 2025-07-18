using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using CosmoBack.CosmoDBContext;

namespace CosmoBack.Repositories.Classes
{
    public class MessagesRepository(CosmoDbContext context) : Repository<Message>(context), IMessageRepository
    {
        public async Task<IEnumerable<Message>> GetMessagesByChatIdAsync(Guid chatId)
        {
            return await _context.Set<Message>()
                .Where(m => m.ChatId == chatId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Message>> GetMessagesByGroupIdAsync(Guid groupId)
        {
            return await _context.Set<Message>()
                .Where(m => m.GroupId == groupId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Message>> GetMessagesByChannelIdAsync(Guid channelId)
        {
            return await _context.Set<Message>()
                .Where(m => m.ChannelId == channelId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Message>> GetMessagesBySenderIdAsync(Guid senderId)
        {
            return await _context.Set<Message>()
                .Where(m => m.SenderId == senderId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}