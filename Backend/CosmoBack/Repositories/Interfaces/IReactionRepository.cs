using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IReactionRepository
    {
        Task AddAsync(Reaction reaction);
        Task<bool> DeleteAsync(Guid reactionId, Guid userId); 
        Task<List<Reaction>> GetByMessageIdAsync(Guid messageId);
        Task<List<(string Emoji, int Count, List<Reaction> Reactions)>> GetAggregatedByMessageIdAsync(Guid messageId);
    }
}