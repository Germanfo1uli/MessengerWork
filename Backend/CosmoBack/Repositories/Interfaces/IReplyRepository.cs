using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IReplyRepository
    {
        Task<Reply> CreateReplyAsync(Reply reply);
        Task<IEnumerable<Reply>> GetRepliesByMessageIdAsync(Guid messageId);
    }
}