using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IUserService userService, IUserRepository userRepository) : ControllerBase
    {
        private readonly IUserService _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(Guid userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return NotFound($"Пользователь с ID {userId} не найден");
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Phone = user.Phone,
                    PasswordHash = user.PasswordHash,
                    CreatedAt = user.CreatedAt,
                    Bio = user.Bio,
                    AvatarImageId = user.AvatarImageId,
                    LastSeen = user.LastSeen,
                    IsActive = user.IsActive,
                    PublicName = user.PublicName,
                    OnlineStatus = user.OnlineStatus,
                    Theme = user.Theme
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Ошибка при получении пользователя: {ex.Message}");
            }
        }

        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            try
            {
                var user = await _userService.GetUserByUsernameAsync(username);
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Phone = user.Phone,
                    Username = user.Username
                };
                return Ok(userDto);
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

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var userIdFromToken = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не аутентифицирован"));
                if (userIdFromToken != updateUserDto.Id)
                {
                    return Forbid("Вы можете обновлять только свой профиль");
                }

                var user = await _userService.GetUserByIdAsync(updateUserDto.Id);
                if (user == null)
                {
                    return NotFound("Пользователь не найден");
                }

                if (!string.IsNullOrEmpty(updateUserDto.Username))
                    user.Username = updateUserDto.Username;
                if (!string.IsNullOrEmpty(updateUserDto.Phone))
                    user.Phone = updateUserDto.Phone;
                if (updateUserDto.Bio != null)
                    user.Bio = updateUserDto.Bio;
                if (!string.IsNullOrEmpty(updateUserDto.PublicName))
                    user.PublicName = updateUserDto.PublicName;
                if (updateUserDto.Theme.HasValue)
                    user.Theme = updateUserDto.Theme.Value;
                if (updateUserDto.AvatarImageId.HasValue)
                    user.AvatarImageId = updateUserDto.AvatarImageId;

                await _userService.UpdateUserAsync(user);
                return Ok("Пользователь обновлен");
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok("Пользователь удален");
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