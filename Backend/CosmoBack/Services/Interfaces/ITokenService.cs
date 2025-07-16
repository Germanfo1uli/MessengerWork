using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface ITokenService
    {
        Task<TokenDto> GenerateTokenAsync(Guid userId);
        Task RevokeTokenAsync(string token);
        Task RevokeAllTokensForUserAsync(Guid userId, string currentToken);
        Task<TokenDto> RefreshTokenAsync(string refreshToken);
    }
}