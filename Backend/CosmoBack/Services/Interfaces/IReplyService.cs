using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IReplyService
    {
        Task<BaseMessageDto> CreateReplyAsync(Guid originalMessageId, string comment, Guid senderId);
        Task<IEnumerable<MessageReplyDto>> GetRepliesByMessageIdAsync(Guid messageId);
    }
}