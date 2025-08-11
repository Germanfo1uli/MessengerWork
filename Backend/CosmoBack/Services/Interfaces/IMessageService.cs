using CosmoBack.Models;
using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IMessageService
    {
        Task<Message> GetMessageByIdAsync(Guid id);
        Task<IEnumerable<ChatMessageDto>> GetMessagesByChatAsync(Guid chatId); 
        Task<IEnumerable<GroupMessageDto>> GetMessagesByGroupAsync(Guid groupId);
        Task<IEnumerable<ChannelMessageDto>> GetMessagesByChannelAsync(Guid channelId); 
        Task<IEnumerable<Message>> GetMessagesBySenderAsync(Guid senderId);
        Task<Message> CreateMessageAsync(Message message);
        Task DeleteMessageAsync(Guid messageId);
        Task<Message> UpdateMessageAsync(Guid messageId, string newContent);
    }
}