using CosmoBack.Models;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GroupMembersController : ControllerBase
    {
        private readonly IGroupMembersService _groupMembersService;

        public GroupMembersController(IGroupMembersService groupMembersService)
        {
            _groupMembersService = groupMembersService;
        }

        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] AddGroupMemberRequest request)
        {
            try
            {
                await _groupMembersService.AddMemberAsync(request.GroupId, request.UserId, request.Role);
                return Ok("Участник добавлен");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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

        [HttpDelete("{groupId}/user/{userId}")]
        public async Task<IActionResult> RemoveMember(Guid groupId, Guid userId)
        {
            try
            {
                await _groupMembersService.RemoveMemberAsync(groupId, userId);
                return Ok("Участник удалён");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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

    public class AddGroupMemberRequest
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public GroupRole Role { get; set; }
    }
}