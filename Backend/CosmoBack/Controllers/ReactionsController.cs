using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReactionsController(IReactionService reactionService) : ControllerBase
    {
        private readonly IReactionService _reactionService = reactionService;

        [HttpPost]
        public async Task<IActionResult> AddReaction([FromBody] AddReactionRequest request)
        {
            try
            {
                var userId = User.GetUserId();
                var reaction = await _reactionService.AddReactionAsync(request.MessageId, userId, request.Emoji);
                return Ok(reaction);
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

        [HttpDelete("{reactionId}")]
        public async Task<IActionResult> DeleteReaction(Guid reactionId)
        {
            try
            {
                var userId = User.GetUserId();
                await _reactionService.DeleteReactionAsync(reactionId, userId);
                return Ok("Реакция удалена");
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

    public class AddReactionRequest
    {
        public Guid MessageId { get; set; }
        public string Emoji { get; set; } = default!;
    }
}