using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CosmoBack.Models.ChannelMember;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChannelMembersController(
        IChannelMembersRepository channelMembersRepository,
        IChannelRepository channelRepository,
        CosmoDbContext context,
        ILogger<ChannelMembersController> logger) : ControllerBase
    {
        private readonly IChannelMembersRepository _channelMembersRepository = channelMembersRepository;
        private readonly IChannelRepository _channelRepository = channelRepository;
        private readonly CosmoDbContext _context = context;
        private readonly ILogger<ChannelMembersController> _logger = logger;

        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] AddChannelMemberRequest request)
        {
            try
            {
                var currentUserId = User.GetUserId();

                var channel = await _channelRepository.GetChannelByIdWithMessagesAsync(request.ChannelId);
                if (channel == null)
                    throw new KeyNotFoundException($"Канал с ID {request.ChannelId} не найден");

                if (channel.OwnerId != currentUserId)
                    throw new UnauthorizedAccessException("Только владелец может добавлять участников в канал");

                var channelMember = new ChannelMember
                {
                    Id = Guid.NewGuid(),
                    ChannelId = request.ChannelId,
                    UserId = request.UserId,
                    Role = request.IsModerator ? ChannelRole.Moderator : ChannelRole.Member,
                    Notifications = true,
                    IsFavorite = false
                };

                await _channelMembersRepository.AddAsync(channelMember);
                channel.MembersNumber++;
                _context.Update(channel); 
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} added to channel {ChannelId} with role {Role}", request.UserId, request.ChannelId, channelMember.Role);

                return Ok("Участник добавлен");
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
                _logger.LogError(ex, "Error adding member to channel {ChannelId}", request.ChannelId);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{channelId}/moderator")]
        public async Task<IActionResult> SetModerator(Guid channelId, [FromBody] SetModeratorRequest request)
        {
            try
            {
                var currentUserId = User.GetUserId();

                var channel = await _channelRepository.GetChannelByIdWithMessagesAsync(channelId);
                if (channel == null)
                    throw new KeyNotFoundException($"Канал с ID {channelId} не найден");

                if (channel.OwnerId != currentUserId)
                    throw new UnauthorizedAccessException("Только владелец может назначать модераторов");

                var channelMember = await _channelMembersRepository.GetByChannelAndUserIdAsync(channelId, request.UserId);
                if (channelMember == null)
                    throw new KeyNotFoundException($"Пользователь {request.UserId} не является участником канала");

                channelMember.Role = request.IsModerator ? ChannelRole.Moderator : ChannelRole.Member;
                await _channelMembersRepository.UpdateAsync(channelMember);

                _logger.LogInformation("User {UserId} role updated to {Role} in channel {ChannelId}", request.UserId, channelMember.Role, channelId);

                return Ok("Роль модератора обновлена");
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
                _logger.LogError(ex, "Error setting moderator for channel {ChannelId}", channelId);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{channelId}/user/{userId}")]
        public async Task<IActionResult> RemoveMember(Guid channelId, Guid userId)
        {
            try
            {
                var currentUserId = User.GetUserId();

                var channel = await _channelRepository.GetChannelByIdWithMessagesAsync(channelId);
                if (channel == null)
                    throw new KeyNotFoundException($"Канал с ID {channelId} не найден");

                if (channel.OwnerId != currentUserId)
                    throw new UnauthorizedAccessException("Только владелец может удалять участников из канала");

                var channelMember = await _channelMembersRepository.GetByChannelAndUserIdAsync(channelId, userId);
                if (channelMember == null)
                    throw new KeyNotFoundException($"Пользователь {userId} не является участником канала");

                await _channelMembersRepository.DeleteByChannelIdAndUserIdAsync(channelId, userId);
                channel.MembersNumber--;
                _context.Update(channel); 
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} removed from channel {ChannelId}", userId, channelId);

                return Ok("Участник удалён");
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
                _logger.LogError(ex, "Error removing member from channel {ChannelId}", channelId);
                return BadRequest(ex.Message);
            }
        }
    }

    public class AddChannelMemberRequest
    {
        public Guid ChannelId { get; set; }
        public Guid UserId { get; set; }
        public bool IsModerator { get; set; }
    }

    public class SetModeratorRequest
    {
        public Guid UserId { get; set; }
        public bool IsModerator { get; set; }
    }
}