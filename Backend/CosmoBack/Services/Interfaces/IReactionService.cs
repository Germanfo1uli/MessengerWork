using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IReactionService
    {
        Task<ReactionDto> AddReactionAsync(Guid messageId, Guid userId, string emoji);
        Task DeleteReactionAsync(Guid reactionId, Guid userId);
    }
}
