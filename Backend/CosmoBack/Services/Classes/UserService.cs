using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace CosmoBack.Services.Classes
{
    public class UserService(IUserRepository userRepository, CosmoDbContext context) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly CosmoDbContext _context = context;

        public async Task<User> GetUserByIdAsync(Guid id)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Пользователь с ID {id} не найден");
                }

                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении пользователя: {ex.Message}", ex);
            }
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            try
            {
                var user = await _userRepository.GetByUsernameAsync(username);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Пользователь с именем {username} не найден");
                }

                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении пользователя по имени: {ex.Message}", ex);
            }
        }

        public async Task<User> GetUserByPublicnameAsync(string publicname)
        {
            try
            {
                var user = await _userRepository.GetByPublicnameAsync(publicname);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Пользователь с публичным именем {publicname} не найден");
                }

                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении пользователя по публичному имени: {ex.Message}", ex);
            }
        }

        public async Task<User> CreateUserAsync(User user)
        {
            try
            {
                var existingUser = await _userRepository.GetByUsernameAsync(user.Phone);
                if (existingUser != null)
                {
                    throw new InvalidOperationException("Пользователь с таким телефоном уже существует");
                }

                user.CreatedAt = DateTime.UtcNow;
                user.OnlineStatus = OnlineStatus.Offline;
                user.LastSeen = DateTime.UtcNow;
                user.IsActive = true;

                await _userRepository.AddAsync(user);
                return await GetUserByIdAsync(user.Id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при создании пользователя: {ex.Message}", ex);
            }
        }

        public async Task UpdateUserAsync(User user)
        {
            try
            {
                var existingUser = await _userRepository.GetByIdAsync(user.Id);
                if (existingUser == null)
                {
                    throw new KeyNotFoundException($"Пользователь с ID {user.Id} не найден");
                }

                if (await _context.Users.AnyAsync(u => u.Id != user.Id && u.Phone == user.Phone))
                {
                    throw new InvalidOperationException("Пользователь с таким номером телефона уже существует");
                }

                existingUser.Username = user.Username;
                existingUser.Phone = user.Phone;
                existingUser.Bio = user.Bio;
                existingUser.PublicName = user.PublicName;
                existingUser.AvatarImageId = user.AvatarImageId;
                existingUser.Theme = user.Theme;
                existingUser.LastSeen = DateTime.UtcNow;

                await _userRepository.UpdateAsync(existingUser);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при обновлении пользователя: {ex.Message}", ex);
            }
        }

        public async Task DeleteUserAsync(Guid id)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Пользователь с ID {id} не найден");
                }

                user.IsActive = false;
                await _userRepository.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при удалении пользователя: {ex.Message}", ex);
            }
        }

        public async Task<User> RegisterByUsernameAsync(string username, string password, string phone)
        {
            try
            {
                var user = new User
                {
                    Username = username,
                    Phone = phone,
                    PasswordHash = HashPassword(password),
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    OnlineStatus = OnlineStatus.Online,
                    LastSeen = DateTime.UtcNow
                };

                return await CreateUserAsync(user);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при регистрации по имени пользователя: {ex.Message}", ex);
            }
        }

        public async Task<User> RegisterByPhoneAsync(string phone, string password)
        {
            try
            {
                var user = new User
                {
                    Username = phone,
                    Phone = phone,
                    PasswordHash = HashPassword(password),
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    OnlineStatus = OnlineStatus.Online,
                    LastSeen = DateTime.UtcNow
                };

                return await CreateUserAsync(user);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при регистрации по телефону: {ex.Message}", ex);
            }
        }

        public async Task<User> LoginByUsernameAsync(string username, string password)
        {
            try
            {
                var user = await GetUserByUsernameAsync(username);
                if (!VerifyPassword(password, user.PasswordHash))
                {
                    throw new UnauthorizedAccessException("Неверный пароль");
                }

                user.OnlineStatus = OnlineStatus.Online;
                user.LastSeen = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);

                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при входе по имени пользователя: {ex.Message}", ex);
            }
        }

        public async Task<User> LoginByPhoneAsync(string phone, string password)
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
                throw new Exception($"Ошибка при входе по телефону: {ex.Message}", ex);
            }
        }

        public async Task<bool> CheckUserCredentialsAsync(string username, string password)
        {
            try
            {
                var user = await _userRepository.GetByUsernameAsync(username);
                return user != null && VerifyPassword(password, user.PasswordHash);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при проверке учетных данных: {ex.Message}", ex);
            }
        }

        public async Task UpdateUserLastSeenAsync(Guid userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Пользователь с ID {userId} не найден");
                }

                user.LastSeen = DateTime.UtcNow;
                user.OnlineStatus = OnlineStatus.Online;
                await _userRepository.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при обновлении времени последнего входа: {ex.Message}", ex);
            }
        }

        public async Task ResetPasswordAsync(string phone, string oldPassword, string newPassword)
        {
            try
            {
                var user = await _userRepository.GetByPhoneAsync(phone);
                if (user == null || !VerifyPassword(oldPassword, user.PasswordHash))
                {
                    throw new UnauthorizedAccessException("Неверный телефон или пароль");
                }

                user.PasswordHash = HashPassword(newPassword);
                await _userRepository.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при сбросе пароля: {ex.Message}", ex);
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