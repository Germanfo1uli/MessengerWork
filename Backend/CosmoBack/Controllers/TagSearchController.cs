using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController(ITagSearchService searchService) : ControllerBase
    {
        private readonly ITagSearchService _searchService = searchService;

        [HttpGet("tag/{tag}")]
        public async Task<IActionResult> SearchByTag(string tag)
        {
            try
            {
                var userId = User.GetUserId();
                var results = await _searchService.SearchByTagAsync(userId, tag);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}