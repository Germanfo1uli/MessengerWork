using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface ITokenService
    {
        Task<Token> GenerateTokenAsync(Guid userId);
        Task RevokeTokenAsync(string token);
        Task RevokeAllTokensForUserAsync(Guid userId, string currentToken);
        Task<Token> RefreshTokenAsync(string refreshToken);
    }
}