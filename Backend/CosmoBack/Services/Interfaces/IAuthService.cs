using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User> AuthenticateAsync(string phone, string password);
        Task<User> RegisterAsync(User user, string password);
        Task<bool> ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
        Task<User> GetCurrentUserAsync();
    }
}