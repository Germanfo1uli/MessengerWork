using CosmoBack.Models;
using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IUserService
    {
        Task<(UserDto, ImageDto?)> GetUserByIdAsync(Guid id);
        Task<User> GetUserByUsernameAsync(string username);
        Task<User> GetUserByPublicnameAsync(string publicname);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);
        Task<User> RegisterByUsernameAsync(string username, string password, string phone);
        Task<User> RegisterByPhoneAsync(string phone, string password);
        Task<User> LoginByUsernameAsync(string username, string password);
        Task<User> LoginByPhoneAsync(string phone, string password);
        Task<bool> CheckUserCredentialsAsync(string username, string password);
        Task UpdateUserLastSeenAsync(Guid userId);
        Task ResetPasswordAsync(string phone, string oldPassword, string newPassword);
    }
}