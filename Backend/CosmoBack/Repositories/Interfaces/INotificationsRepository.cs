using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface INotificationsRepository : IRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetAllByUserIdAsync(Guid userId);
        Task<IEnumerable<Notification>> GetAllByChatIdAsync(Guid chatId);
        Task<IEnumerable<Notification>> GetAllByGroupIdAsync(Guid groupId);
        Task<IEnumerable<Notification>> GetAllByChannelIdAsync(Guid channelId);
    }
}