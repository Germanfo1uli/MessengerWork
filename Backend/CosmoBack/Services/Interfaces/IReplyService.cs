using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IReplyService
    {
        Task<ChatMessageDto> CreateReplyAsync(Guid originalMessageId, string comment, Guid senderId);
        Task<IEnumerable<MessageReplyDto>> GetRepliesByMessageIdAsync(Guid messageId);
    }
}