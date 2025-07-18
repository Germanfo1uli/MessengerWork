using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IMessageRepository : IRepository<Message>
    {
        Task<IEnumerable<Message>> GetMessagesByChatIdAsync(Guid chatId);
        Task<IEnumerable<Message>> GetMessagesByGroupIdAsync(Guid groupId);
        Task<IEnumerable<Message>> GetMessagesByChannelIdAsync(Guid channelId);
        Task<IEnumerable<Message>> GetMessagesBySenderIdAsync(Guid senderId);
    }
}