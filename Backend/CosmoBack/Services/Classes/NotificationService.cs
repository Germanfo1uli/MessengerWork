using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationsRepository _notificationRepository;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            INotificationsRepository notificationRepository,
            ILogger<NotificationService> logger)
        {
            _notificationRepository = notificationRepository ?? throw new ArgumentNullException(nameof(notificationRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

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
            _logger.LogInformation("Creating notification for user {UserId} in chat {ChatId}", notification.UserId, notification.ChatId);
            try
            {
                await _notificationRepository.AddAsync(notification);
                return notification;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification for user {UserId} in chat {ChatId}", notification.UserId, notification.ChatId);
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
    }
}