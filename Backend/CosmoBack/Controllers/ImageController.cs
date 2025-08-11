using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController(IImageService imageService) : ControllerBase
    {
        private readonly IImageService _imageService = imageService;

        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] Guid entityId, [FromForm] string entityType, [FromForm] IFormFile file)
        {
            try
            {
                var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));

                if (file == null || file.Length == 0)
                {
                    return BadRequest("Файл не предоставлен");
                }

                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                var imageDto = await _imageService.UploadAvatarAsync(
                    entityId,
                    entityType,
                    fileBytes,
                    file.FileName,
                    file.ContentType,
                    file.Length);

                return Ok(imageDto);
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

        [HttpGet("avatar/{entityType}/{entityId}")]
        public async Task<IActionResult> GetAvatar(string entityType, Guid entityId)
        {
            try
            {
                var imageDto = await _imageService.GetAvatarAsync(entityType, entityId);
                if (imageDto == null)
                {
                    return NotFound($"Аватар для {entityType} с ID {entityId} не найден");
                }

                return File(imageDto.Data, imageDto.MimeType, imageDto.FileName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("avatar/{imageId}")]
        public async Task<IActionResult> DeleteAvatar(Guid imageId)
        {
            try
            {
                await _imageService.DeleteAvatarAsync(imageId);
                return Ok("Аватар удалён");
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
    }
}