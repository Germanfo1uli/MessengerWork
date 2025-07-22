using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RepliesController(IReplyService replyService) : ControllerBase
    {
        private readonly IReplyService _replyService = replyService;

        [HttpPost]
        public async Task<IActionResult> CreateReply([FromBody] CreateReplyDto dto)
        {
            var SenderId = User.GetUserId();
            try
            {
                var reply = await _replyService.CreateReplyAsync(dto.OriginalMessageId, dto.Comment, SenderId);
                return Ok(reply);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("message/{messageId}")]
        public async Task<IActionResult> GetReplies(Guid messageId)
        {
            try
            {
                var replies = await _replyService.GetRepliesByMessageIdAsync(messageId);
                return Ok(replies);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public class CreateReplyDto
        {
            public Guid OriginalMessageId { get; set; }
            public string Comment { get; set; } = default!;
        }
    }
}