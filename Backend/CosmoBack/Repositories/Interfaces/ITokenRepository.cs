using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface ITokenRepository : IRepository<Token>
    {
        Task RevokeRefreshTokenAsync(string token);
        Task RevokeRefreshTokensUserAsync(Guid userId, string token);
    }
}
