using CosmoBack.Models;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController(INotificationService notificationService) : ControllerBase
    {
        private readonly INotificationService _notificationService = notificationService;

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(Guid userId)
        {
            try
            {
                var notifications = await _notificationService.GetUserNotificationsAsync(userId);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] Notification notification)
        {
            try
            {
                var createdNotification = await _notificationService.CreateNotificationAsync(notification);
                return StatusCode(201, createdNotification);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{notificationId}/toggle")]
        public async Task<IActionResult> ToggleNotificationStatus(Guid notificationId)
        {
            try
            {
                await _notificationService.ToggleNotificationStatusAsync(notificationId);
                return Ok("Статус уведомления изменён");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{notificationId}")]
        public async Task<IActionResult> DeleteNotification(Guid notificationId)
        {
            try
            {
                await _notificationService.DeleteNotificationAsync(notificationId);
                return Ok("Уведомление удалено");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("group/{groupId}")]
        public async Task<IActionResult> DeleteNotificationsByGroupId(Guid groupId)
        {
            try
            {
                await _notificationService.DeleteNotificationsByGroupIdAsync(groupId);
                return Ok("Уведомления для группы удалены");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}