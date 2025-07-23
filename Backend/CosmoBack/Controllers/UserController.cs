using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IUserService userService, IUserRepository userRepository) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IUserRepository _userRepository = userRepository;

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(Guid userId)
        {
            try
            {
                var (userDto, avatarImage) = await _userService.GetUserByIdAsync(userId);
                return Ok(new { User = userDto, AvatarImage = avatarImage });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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
                var currentUserId = User.GetUserId();
                if (currentUserId != updateUserDto.Id)
                {
                    return Forbid("Вы можете обновлять только свой профиль");
                }

                var (userDto, _) = await _userService.GetUserByIdAsync(updateUserDto.Id);
                if (userDto == null)
                {
                    return NotFound("Пользователь не найден");
                }

                var user = new User
                {
                    Id = userDto.Id,
                    Username = userDto.Username,
                    Phone = userDto.Phone,
                    PasswordHash = userDto.PasswordHash,
                    CreatedAt = userDto.CreatedAt,
                    Bio = userDto.Bio,
                    AvatarImageId = userDto.AvatarImageId,
                    LastSeen = userDto.LastSeen,
                    IsActive = userDto.IsActive,
                    PublicName = userDto.PublicName,
                    OnlineStatus = userDto.OnlineStatus,
                    Theme = userDto.Theme
                };

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