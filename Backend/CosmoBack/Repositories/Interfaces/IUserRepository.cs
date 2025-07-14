using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByUsernameAsync(string username);
        Task<User> GetByPublicnameAsync(string publicname);
    }
}