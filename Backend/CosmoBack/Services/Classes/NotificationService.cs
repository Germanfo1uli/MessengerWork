using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationsRepository _notificationRepository;

        public NotificationService(INotificationsRepository notificationRepository)
        {
            _notificationRepository = notificationRepository ?? throw new ArgumentNullException(nameof(notificationRepository));
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(Guid userId)
        {
            try
            {
                return await _notificationRepository.GetAllByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
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
            try
            {
                var notification = await _notificationRepository.GetByIdAsync(notificationId);
                if (notification == null)
                {
                    throw new KeyNotFoundException($"Уведомление с ID {notificationId} не найдено");
                }

                notification.IsEnabled = !notification.IsEnabled; 
                await _notificationRepository.UpdateAsync(notification);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при переключении статуса уведомлений: {ex.Message}", ex);
            }
        }

        public async Task DeleteNotificationAsync(Guid notificationId)
        {
            try
            {
                await _notificationRepository.DeleteAsync(notificationId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при удалении уведомления: {ex.Message}", ex);
            }
        }
    }
}