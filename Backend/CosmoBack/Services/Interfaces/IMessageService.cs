using CosmoBack.Models;
using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IMessageService
    {
        Task<Message> GetMessageByIdAsync(Guid id);
        Task<IEnumerable<Message>> GetMessagesByChatAsync(Guid chatId);
        Task<IEnumerable<Message>> GetMessagesByGroupAsync(Guid groupId);
        Task<IEnumerable<GroupMessageDto>> GetMessagesByGroupWithDetailsAsync(Guid groupId);
        Task<IEnumerable<Message>> GetMessagesByChannelAsync(Guid channelId);
        Task<IEnumerable<Message>> GetMessagesBySenderAsync(Guid senderId);
        Task<Message> CreateMessageAsync(Message message);
        Task DeleteMessageAsync(Guid messageId);
        Task<Message> UpdateMessageAsync(Guid messageId, string newContent);
    }
}