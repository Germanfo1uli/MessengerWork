using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController(IGroupService groupService) : ControllerBase
    {
        private readonly IGroupService _groupService = groupService;

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroupById(Guid id)
        {
            try
            {
                var group = await _groupService.GetGroupByIdAsync(id);
                return Ok(group);
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
        public async Task<IActionResult> GetUserGroups(Guid userId)
        {
            try
            {
                var groups = await _groupService.GetUserGroupsAsync(userId);
                return Ok(groups.Select(g => new { Group = g.Item1, AvatarImage = g.Item2 }));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            try
            {
                var group = await _groupService.CreateGroupAsync(
                    request.OwnerId,
                    request.Name,
                    request.IsPublic,
                    request.GroupTag,
                    request.Description,
                    request.AvatarImageId);
                return StatusCode(201, group);
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

        [HttpDelete("{groupId}")]
        public async Task<IActionResult> DeleteGroup(Guid groupId)
        {
            try
            {
                await _groupService.DeleteGroupAsync(groupId);
                return Ok("Группа удалена");
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
        public async Task<IActionResult> SendMessage([FromBody] SendGroupMessageRequest request)
        {
            try
            {
                var message = await _groupService.SendMessageAsync(request.GroupId, request.SenderId, request.Comment);
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

        [HttpPut("{groupId}/favorite")]
        public async Task<IActionResult> ToggleFavoriteGroup(Guid groupId, [FromBody] ToggleFavoriteGroupRequest request)
        {
            try
            {
                var currentUserId = User.GetUserId();
                var group = await _groupService.ToggleFavoriteGroupAsync(groupId, currentUserId, request.Favorite);
                return Ok(group);
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

    public class CreateGroupRequest
    {
        public Guid OwnerId { get; set; }
        public string Name { get; set; } = default!;
        public bool IsPublic { get; set; }
        public string? GroupTag { get; set; }
        public string? Description { get; set; }
        public Guid? AvatarImageId { get; set; }
    }

    public class SendGroupMessageRequest
    {
        public Guid GroupId { get; set; }
        public Guid SenderId { get; set; }
        public string Comment { get; set; } = default!;
    }

    public class ToggleFavoriteGroupRequest
    {
        public bool Favorite { get; set; }
    }
}