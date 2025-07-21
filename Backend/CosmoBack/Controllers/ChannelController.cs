using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChannelsController(IChannelService channelService) : ControllerBase
    {
        private readonly IChannelService _channelService = channelService;

        [HttpGet("{id}")]
        public async Task<IActionResult> GetChannelById(Guid id)
        {
            try
            {
                var channel = await _channelService.GetChannelByIdAsync(id);
                return Ok(channel);
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

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserChannels(Guid userId)
        {
            try
            {
                var channels = await _channelService.GetUserChannelsAsync(userId);
                return Ok(channels);
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

        [HttpPost]
        public async Task<IActionResult> CreateChannel([FromBody] CreateChannelRequest request)
        {
            try
            {
                var channel = await _channelService.CreateChannelAsync(
                    request.OwnerId,
                    request.Name,
                    request.IsPublic,
                    request.ChannelTag,
                    request.Description,
                    request.AvatarImageId);
                return StatusCode(201, channel);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
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

        [HttpPost("{channelId}/message")]
        public async Task<IActionResult> SendChannelMessage(Guid channelId, [FromBody] SendChannelMessageRequest request)
        {
            try
            {
                var message = await _channelService.SendChannelMessageAsync(channelId, request.SenderId, request.Comment);
                return Ok(message);
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

        [HttpDelete("{channelId}")]
        public async Task<IActionResult> DeleteChannel(Guid channelId)
        {
            try
            {
                await _channelService.DeleteChannelAsync(channelId);
                return Ok("Канал удалён");
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

        [HttpPut("{channelId}/favorite")]
        public async Task<IActionResult> ToggleFavoriteChannel(Guid channelId, [FromBody] ToggleFavoriteChannelRequest request)
        {
            try
            {
                var channel = await _channelService.ToggleFavoriteChannelAsync(channelId, request.UserId, request.Favorite);
                return Ok(channel);
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

    public class CreateChannelRequest
    {
        public Guid OwnerId { get; set; }
        public string Name { get; set; } = default!;
        public bool IsPublic { get; set; }
        public string? ChannelTag { get; set; }
        public string? Description { get; set; }
        public Guid? AvatarImageId { get; set; }
    }

    public class SendChannelMessageRequest
    {
        public Guid SenderId { get; set; }
        public string Comment { get; set; } = default!;
    }

    public class ToggleFavoriteChannelRequest
    {
        public Guid UserId { get; set; }
        public bool Favorite { get; set; }
    }
}