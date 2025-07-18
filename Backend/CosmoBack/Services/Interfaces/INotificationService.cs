using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(Guid userId);
        Task<Notification> CreateNotificationAsync(Notification notification);
        Task ToggleNotificationStatusAsync(Guid notificationId);
        Task DeleteNotificationAsync(Guid notificationId);
        Task DeleteNotificationsByChatIdAsync(Guid chatId);
        Task DeleteNotificationsByGroupIdAsync(Guid groupId);
        Task DeleteNotificationsByChannelIdAsync(Guid channelId); 
    }
}