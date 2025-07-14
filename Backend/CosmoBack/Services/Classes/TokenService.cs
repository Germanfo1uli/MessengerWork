using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CosmoBack.Services
{
    public class TokenService(ITokenRepository tokenRepository, IUserRepository userRepository, IConfiguration configuration) : ITokenService
    {
        private readonly ITokenRepository _tokenRepository = tokenRepository ?? throw new ArgumentNullException(nameof(tokenRepository));
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly string _jwtSecret = configuration["Jwt:Secret"] ?? throw new ArgumentNullException("Jwt:Secret не настроен");
        private readonly TimeSpan _tokenLifetime = TimeSpan.FromHours(24);

        public async Task<Token> GenerateTokenAsync(Guid userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Пользователь с ID {userId} не найден");
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSecret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim("sub", userId.ToString()),
                        new Claim("username", user.Username)
                    }),
                    Expires = DateTime.UtcNow.Add(_tokenLifetime),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature)
                };

                var jwtToken = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(jwtToken);

                var token = new Token
                {
                    UserId = userId,
                    Name = "JWT",
                    ClientId = Guid.NewGuid().ToString(),
                    ClientSecret = Guid.NewGuid().ToString(), // В реальной системе использовать безопасный генератор
                    AuthorizationEndpoint = "https://auth.cosmoback.com/authorize",
                    TokenEndpoint = "https://auth.cosmoback.com/token",
                    UserInfoEndpoint = "https://auth.cosmoback.com/userinfo",
                };

                await _tokenRepository.AddAsync(token);
                return token;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при генерации токена: {ex.Message}", ex);
            }
        }

        public async Task RevokeTokenAsync(string token)
        {
            try
            {
                await _tokenRepository.RevokeRefreshTokenAsync(token);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при отзыве токена: {ex.Message}", ex);
            }
        }

        public async Task RevokeAllTokensForUserAsync(Guid userId, string currentToken)
        {
            try
            {
                await _tokenRepository.RevokeRefreshTokensUserAsync(userId, currentToken);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при отзыве всех токенов пользователя: {ex.Message}", ex);
            }
        }

        public async Task<Token> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                var token = await _tokenRepository.GetByIdAsync(Guid.Parse(refreshToken)); // Предполагается, что ClientSecret хранит refresh token
                if (token == null)
                {
                    throw new SecurityTokenException("Недействительный refresh token");
                }

                // Удаляем старый токен
                await _tokenRepository.RevokeRefreshTokenAsync(token.ClientSecret);

                // Генерируем новый токен
                return await GenerateTokenAsync(token.UserId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при обновлении токена: {ex.Message}", ex);
            }
        }
    }
}