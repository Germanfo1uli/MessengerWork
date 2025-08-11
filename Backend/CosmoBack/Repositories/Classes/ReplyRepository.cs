using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ReplyRepository(CosmoDbContext context) : IReplyRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<Reply> CreateReplyAsync(Reply reply)
        {
            await _context.Replies.AddAsync(reply);
            await _context.SaveChangesAsync();
            return reply;
        }

        public async Task<IEnumerable<Reply>> GetRepliesByMessageIdAsync(Guid messageId)
        {
            return await _context.Replies
                .Where(r => r.OriginalMessageId == messageId)
                .Include(r => r.ReplyMessage)
                .ThenInclude(m => m.Sender)
                .ToListAsync();
        }
    }
}