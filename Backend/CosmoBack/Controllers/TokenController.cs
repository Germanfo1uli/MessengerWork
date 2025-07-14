using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TokenController(ITokenService tokenService) : ControllerBase
    {
        private readonly ITokenService _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            try
            {
                var token = await _tokenService.RefreshTokenAsync(refreshToken);
                return Ok(token);
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("revoke")]
        public async Task<IActionResult> RevokeToken([FromBody] string token)
        {
            try
            {
                await _tokenService.RevokeTokenAsync(token);
                return Ok("Токен отозван");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("revoke-all/{userId}")]
        public async Task<IActionResult> RevokeAllTokens(Guid userId, [FromBody] string currentToken)
        {
            try
            {
                await _tokenService.RevokeAllTokensForUserAsync(userId, currentToken);
                return Ok("Все токены пользователя отозваны");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}