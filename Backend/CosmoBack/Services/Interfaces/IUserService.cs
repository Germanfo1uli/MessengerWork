using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface IUserService
    {
        // Основные CRUD-операции
        Task<User> GetUserByIdAsync(Guid id);
        Task<User> GetUserByUsernameAsync(string username);
        Task<User> GetUserByPublicnameAsync(string publicname);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);

        // Аутентификация
        Task<User> RegisterByUsernameAsync(string username, string password, string phone);
        Task<User> RegisterByPhoneAsync(string phone, string password);
        Task<User> LoginByUsernameAsync(string username, string password);
        Task<User> LoginByPhoneAsync(string phone, string password);
        Task<bool> CheckUserCredentialsAsync(string username, string password);

        // Управление сессиями
        Task UpdateUserLastSeenAsync(Guid userId);

        // Восстановление доступа
        Task ResetPasswordAsync(string phone,string oldPassword, string newPassword);

    }
}
