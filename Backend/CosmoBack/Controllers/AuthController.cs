using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CosmoBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, ITokenService tokenService, IUserService userService) : ControllerBase
    {
        private readonly IAuthService _authService = authService ?? throw new ArgumentNullException(nameof(authService));
        private readonly ITokenService _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        private readonly IUserService _userService = userService ?? throw new ArgumentNullException(nameof(userService));

        [HttpPost("login/phone")]
        public async Task<IActionResult> LoginByPhone([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _authService.AuthenticateAsync(request.Phone, request.Password);
                var token = await _tokenService.GenerateTokenAsync(user.Id);
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Phone = user.Phone,
                    Username = user.Username
                };
                return Ok(new { User = userDto, Token = token });
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

        [HttpPost("login/username")]
        public async Task<IActionResult> LoginByUsername([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _userService.LoginByUsernameAsync(request.Username, request.Password);
                var token = await _tokenService.GenerateTokenAsync(user.Id);
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Phone = user.Phone,
                    Username = user.Username
                };
                return Ok(new { User = userDto, Token = token });
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = new User { Phone = request.Phone, Username = request.Username };
                var registeredUser = await _authService.RegisterAsync(user, request.Password);
                var token = await _tokenService.GenerateTokenAsync(registeredUser.Id);
                var userDto = new UserDto
                {
                    Id = registeredUser.Id,
                    Phone = registeredUser.Phone,
                    Username = registeredUser.Username
                };
                return Ok(new { User = userDto, Token = token });
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

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var result = await _authService.ChangePasswordAsync(request.UserId, request.OldPassword, request.NewPassword);
                if (!result)
                {
                    return Unauthorized("Неверный текущий пароль");
                }
                return Ok("Пароль успешно изменен");
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

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                await _userService.ResetPasswordAsync(request.Phone, request.OldPassword, request.NewPassword);
                return Ok("Пароль сброшен");
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

    public class LoginRequest
    {
        public string? Username { get; set; }
        public string? Phone { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Phone { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class ChangePasswordRequest
    {
        public Guid UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Phone { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}