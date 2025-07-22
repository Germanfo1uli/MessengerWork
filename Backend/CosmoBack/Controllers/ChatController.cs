using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController(IChatService chatService) : ControllerBase
    {
        private readonly IChatService _chatService = chatService;

        [HttpGet("{id}")]
        public async Task<IActionResult> GetChatById(Guid id)
        {
            try
            {
                var chat = await _chatService.GetChatByIdAsync(id);
                return Ok(chat);
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

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserChats(Guid userId)
        {
            try
            {
                var chats = await _chatService.GetUserChatsAsync(userId);
                return Ok(chats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[HttpGet("search")]
        //public async Task<IActionResult> SearchChats(Guid userId, string query)
        //{
        //    try
        //    {
        //        var chats = await _chatService.SearchUsersAsync(userId, query);
        //        return Ok(chats);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPost]
        public async Task<IActionResult> CreateChat([FromBody] CreateChatRequest request)
        {
            try
            {
                var currentUserId = User.GetUserId();
                var chat = await _chatService.CreateChatAsync(currentUserId, request.SecondUserId);
                return Ok(chat);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
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

        [HttpDelete("{chatId}")]
        public async Task<IActionResult> DeleteChat(Guid chatId)
        {
            try
            {
                await _chatService.DeleteChatAsync(chatId);
                return Ok("Чат удалён");
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

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            try
            {

                var senderId = User.GetUserId();

                var message = await _chatService.SendMessageAsync(
                    request.ChatId,
                    senderId,
                    request.SecondUserId,
                    request.Comment);

                return Ok(message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    

        [HttpPut("{chatId}/favorite")]
        public async Task<IActionResult> ToggleFavoriteChat(Guid chatId, [FromBody] ToggleFavoriteChatRequest request)
        {
            try
            {
                var chat = await _chatService.ToggleFavoriteChatAsync(chatId, request.IsFavorite);
                return Ok(chat);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class CreateChatRequest
    {
        public Guid FirstUserId { get; set; }
        public Guid SecondUserId { get; set; }
    }

    public class SendMessageRequest
    {
        public Guid? ChatId { get; set; }
        public Guid SecondUserId { get; set; }
        public string Comment { get; set; } = default!;
    }

    public class ToggleFavoriteChatRequest
    {
        public bool IsFavorite { get; set; }
    }
}