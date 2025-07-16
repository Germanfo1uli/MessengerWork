using CosmoBack.Models;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")] 
    public class ChatMembersController(IChatMembersService chatMembersService) : ControllerBase
    {
        private readonly IChatMembersService _chatMembersService = chatMembersService ?? throw new ArgumentNullException(nameof(chatMembersService));

        [HttpGet("{chatId}/{userId}")]
        public async Task<IActionResult> GetChatMember(Guid chatId, Guid userId)
        {
            try
            {
                var chatMember = await _chatMembersService.GetChatMemberAsync(chatId, userId);
                return Ok(chatMember);
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

        [HttpPut("{chatId}/{userId}/notifications")]
        public async Task<IActionResult> UpdateNotificationStatus(Guid chatId, Guid userId, [FromBody] bool isEnabled)
        {
            try
            {
                await _chatMembersService.UpdateNotificationStatusAsync(chatId, userId, isEnabled);
                return Ok("Статус уведомлений обновлен");
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

        [HttpDelete("{chatId}/{userId}")]
        public async Task<IActionResult> RemoveMember(Guid chatId, Guid userId)
        {
            try
            {
                await _chatMembersService.RemoveMemberFromChatAsync(chatId, userId);
                return Ok("Участник удален из чата");
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

        [HttpPost]
        public async Task<IActionResult> AddChatMember([FromBody] AddChatMemberRequest request)
        {
            try
            {
                var chatMember = new ChatMember
                {
                    ChatId = request.ChatId,
                    UserId = request.UserId,
                    Notifications = request.Notifications,
                };
                await _chatMembersService.AddChatMemberAsync(chatMember);
                return Ok(chatMember);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class AddChatMemberRequest
    {
        public Guid ChatId { get; set; }
        public Guid UserId { get; set; }
        public bool Notifications { get; set; } = true;
    }
}