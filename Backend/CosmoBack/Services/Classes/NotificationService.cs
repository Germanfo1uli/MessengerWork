using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class NotificationService(
        INotificationsRepository notificationRepository,
        ILogger<NotificationService> logger) : INotificationService
    {
        private readonly INotificationsRepository _notificationRepository = notificationRepository;
        private readonly ILogger<NotificationService> _logger = logger;

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(Guid userId)
        {
            _logger.LogInformation("Getting notifications for user {UserId}", userId);
            try
            {
                return await _notificationRepository.GetAllByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notifications for user {UserId}", userId);
                throw new Exception($"Ошибка при получении уведомлений пользователя: {ex.Message}", ex);
            }
        }

        public async Task<Notification> CreateNotificationAsync(Notification notification)
        {
            try
            {
                await _notificationRepository.AddAsync(notification);
                return notification;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при создании уведомления: {ex.Message}", ex);
            }
        }

        public async Task ToggleNotificationStatusAsync(Guid notificationId)
        {
            _logger.LogInformation("Toggling notification status for notification {NotificationId}", notificationId);
            try
            {
                var notification = await _notificationRepository.GetByIdAsync(notificationId);
                if (notification == null)
                {
                    _logger.LogWarning("Notification {NotificationId} not found", notificationId);
                    throw new KeyNotFoundException($"Уведомление с ID {notificationId} не найдено");
                }

                notification.IsEnabled = !notification.IsEnabled;
                await _notificationRepository.UpdateAsync(notification);
                _logger.LogInformation("Notification {NotificationId} status toggled to {IsEnabled}", notificationId, notification.IsEnabled);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling notification status for notification {NotificationId}", notificationId);
                throw new Exception($"Ошибка при переключении статуса уведомления: {ex.Message}", ex);
            }
        }

        public async Task DeleteNotificationAsync(Guid notificationId)
        {
            _logger.LogInformation("Deleting notification {NotificationId}", notificationId);
            try
            {
                await _notificationRepository.DeleteAsync(notificationId);
                _logger.LogInformation("Notification {NotificationId} deleted successfully", notificationId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notification {NotificationId}", notificationId);
                throw new Exception($"Ошибка при удалении уведомления: {ex.Message}", ex);
            }
        }

        public async Task DeleteNotificationsByChatIdAsync(Guid chatId)
        {
            _logger.LogInformation("Deleting notifications for chat {ChatId}", chatId);
            try
            {
                var notifications = await _notificationRepository.GetAllByChatIdAsync(chatId);
                foreach (var notification in notifications)
                {
                    await _notificationRepository.DeleteAsync(notification.Id);
                }
                _logger.LogInformation("All notifications for chat {ChatId} deleted successfully", chatId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notifications for chat {ChatId}", chatId);
                throw new Exception($"Ошибка при удалении уведомлений для чата: {ex.Message}", ex);
            }
        }

        public async Task DeleteNotificationsByGroupIdAsync(Guid groupId)
        {
            _logger.LogInformation("Deleting notifications for group {GroupId}", groupId);
            try
            {
                var notifications = await _notificationRepository.GetAllByGroupIdAsync(groupId);
                foreach (var notification in notifications)
                {
                    await _notificationRepository.DeleteAsync(notification.Id);
                }
                _logger.LogInformation("All notifications for group {GroupId} deleted successfully", groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notifications for group {GroupId}", groupId);
                throw new Exception($"Ошибка при удалении уведомлений для группы: {ex.Message}", ex);
            }
        }

        public async Task DeleteNotificationsByChannelIdAsync(Guid channelId)
        {
            _logger.LogInformation("Deleting notifications for channel {ChannelId}", channelId);
            try
            {
                var notifications = await _notificationRepository.GetAllByChannelIdAsync(channelId);
                foreach (var notification in notifications)
                {
                    await _notificationRepository.DeleteAsync(notification.Id);
                }
                _logger.LogInformation("All notifications for channel {ChannelId} deleted successfully", channelId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notifications for channel {ChannelId}", channelId);
                throw new Exception($"Ошибка при удалении уведомлений для канала: {ex.Message}", ex);
            }
        }
    }
}