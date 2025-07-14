using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace CosmoBack.Services.Classes
{
    public class TokenService : ITokenService
    {
        private readonly ITokenRepository _tokenRepository;
        private readonly IUserRepository _userRepository;
        private readonly string _jwtSecret;
        private readonly TimeSpan _tokenLifetime = TimeSpan.FromMinutes(5);

        public TokenService(ITokenRepository tokenRepository, IUserRepository userRepository, IConfiguration configuration)
        {
            _tokenRepository = tokenRepository ?? throw new ArgumentNullException(nameof(tokenRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _jwtSecret = configuration["Jwt:Secret"] ?? throw new ArgumentNullException("Jwt:Secret не настроен");
        }

        public async Task<TokenDto> GenerateTokenAsync(Guid userId)
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

                var refreshToken = new Token
                {
                    UserId = userId,
                    Name = "JWT",
                    ClientId = Guid.NewGuid().ToString(),
                    ClientSecret = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)), 
                    AuthorizationEndpoint = "https://auth.cosmoback.com/authorize",
                    TokenEndpoint = "https://auth.cosmoback.com/token",
                    UserInfoEndpoint = "https://auth.cosmoback.com/userinfo"
                };

                await _tokenRepository.AddAsync(refreshToken);

                return new TokenDto
                {
                    Id = refreshToken.Id,
                    UserId = refreshToken.UserId,
                    Name = refreshToken.Name,
                    ClientId = refreshToken.ClientId,
                    ClientSecret = refreshToken.ClientSecret,
                    TokenValue = tokenString,
                    AuthorizationEndpoint = refreshToken.AuthorizationEndpoint,
                    TokenEndpoint = refreshToken.TokenEndpoint,
                    UserInfoEndpoint = refreshToken.UserInfoEndpoint
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при генерации токена: {ex.Message}", ex);
            }
        }

        public async Task RevokeTokenAsync(string clientSecret)
        {
            try
            {
                await _tokenRepository.RevokeRefreshTokenAsync(clientSecret);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при отзыве токена: {ex.Message}", ex);
            }
        }

        public async Task RevokeAllTokensForUserAsync(Guid userId, string currentClientSecret)
        {
            try
            {
                await _tokenRepository.RevokeRefreshTokensUserAsync(userId, currentClientSecret);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при отзыве всех токенов пользователя: {ex.Message}", ex);
            }
        }

        public async Task<TokenDto> RefreshTokenAsync(string clientSecret)
        {
            try
            {
                var token = await _tokenRepository.GetByClientSecretAsync(clientSecret);
                if (token == null)
                {
                    throw new SecurityTokenException("Недействительный refresh token");
                }

                await _tokenRepository.RevokeRefreshTokenAsync(clientSecret);

                return await GenerateTokenAsync(token.UserId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при обновлении токена: {ex.Message}", ex);
            }
        }
    }
}