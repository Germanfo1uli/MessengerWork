using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController(IMessageService messageService) : ControllerBase
    {
        private readonly IMessageService _messageService = messageService;

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMessage(Guid id)
        {
            try
            {
                var message = await _messageService.GetMessageByIdAsync(id);
                return Ok(message);
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

        [HttpGet("chat/{chatId}")]
        public async Task<IActionResult> GetMessagesByChat(Guid chatId)
        {
            try
            {
                var messages = await _messageService.GetMessagesByChatAsync(chatId);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetMessagesByGroup(Guid groupId)
        {
            try
            {
                var messages = await _messageService.GetMessagesByGroupWithDetailsAsync(groupId);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMessage(Guid id, [FromBody] string newContent)
        {
            try
            {
                var updatedMessage = await _messageService.UpdateMessageAsync(id, newContent);
                return Ok(updatedMessage);
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            try
            {
                await _messageService.DeleteMessageAsync(id);
                return Ok("Сообщение удалено");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}