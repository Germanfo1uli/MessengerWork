using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ReactionRepository(CosmoDbContext context) : IReactionRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task AddAsync(Reaction reaction)
        {
            await _context.Reactions.AddAsync(reaction);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(Guid reactionId, Guid userId)
        {
            var reaction = await _context.Reactions
                .FirstOrDefaultAsync(r => r.Id == reactionId && r.UserId == userId);
            if (reaction == null)
            {
                return false;
            }

            _context.Reactions.Remove(reaction);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Reaction>> GetByMessageIdAsync(Guid messageId)
        {
            return await _context.Reactions
                .Include(r => r.User)
                .Where(r => r.MessageId == messageId)
                .ToListAsync();
        }

        public async Task<List<(string Emoji, int Count, List<Reaction> Reactions)>> GetAggregatedByMessageIdAsync(Guid messageId)
        {
            return await _context.Reactions
                .Include(r => r.User)
                .Where(r => r.MessageId == messageId)
                .GroupBy(r => r.Emoji)
                .Select(g => new
                {
                    Emoji = g.Key,
                    Count = g.Count(),
                    Reactions = g.ToList()
                })
                .ToListAsync()
                .ContinueWith(t => t.Result.Select(r => (r.Emoji, r.Count, r.Reactions)).ToList());
        }
    }
}