using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace CosmoBack.Services.Classes
{
    public class AuthService(IUserRepository userRepository, ITokenService tokenService) : IAuthService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ITokenService _tokenService = tokenService; // пока не используется

        public async Task<User> AuthenticateAsync(string phone, string password)
        {
            try
            {
                var user = await _userRepository.GetByPhoneAsync(phone); 
                if (user == null || !VerifyPassword(password, user.PasswordHash))
                {
                    throw new UnauthorizedAccessException("Неверный телефон или пароль");
                }

                user.OnlineStatus = OnlineStatus.Online;
                user.LastSeen = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);

                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при аутентификации: {ex.Message}", ex);
            }
        }

        public async Task<User> RegisterAsync(User user, string password)
        {
            try
            {
                var existingUser = await _userRepository.GetByUsernameAsync(user.Phone);
                if (existingUser != null)
                {
                    throw new InvalidOperationException("Пользователь с таким телефоном уже существует");
                }

                user.PasswordHash = HashPassword(password);
                user.CreatedAt = DateTime.UtcNow;
                user.OnlineStatus = OnlineStatus.Online;
                user.LastSeen = DateTime.UtcNow;
                user.IsActive = true;

                await _userRepository.AddAsync(user);
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при регистрации: {ex.Message}", ex);
            }
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    throw new KeyNotFoundException("Пользователь не найден");
                }

                if (!VerifyPassword(oldPassword, user.PasswordHash))
                {
                    return false;
                }

                user.PasswordHash = HashPassword(newPassword);
                await _userRepository.UpdateAsync(user);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при смене пароля: {ex.Message}", ex);
            }
        }

        public async Task<User> GetCurrentUserAsync()
        {
            try
            {
                // Ожидает реализации аутентикации
                throw new NotImplementedException("GetCurrentUserAsync не реализован");
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении текущего пользователя: {ex.Message}", ex);
            }
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hash = HashPassword(password);
            return hash == storedHash;
        }
    }
}