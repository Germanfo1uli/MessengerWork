using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface ITokenRepository
    {
        Task AddAsync(Token token);
        Task<Token> GetByClientSecretAsync(string clientSecret);
        Task RevokeRefreshTokenAsync(string clientSecret);
        Task RevokeRefreshTokensUserAsync(Guid userId, string currentClientSecret);
    }
}