using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class TokenRepository(CosmoDbContext context) : ITokenRepository
    {
        private readonly CosmoDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task AddAsync(Token token)
        {
            await _context.Tokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public async Task<Token> GetByClientSecretAsync(string clientSecret)
        {
            return await _context.Tokens
                .FirstOrDefaultAsync(t => t.ClientSecret == clientSecret);
        }

        public async Task RevokeRefreshTokenAsync(string clientSecret)
        {
            var token = await _context.Tokens
                .FirstOrDefaultAsync(t => t.ClientSecret == clientSecret);
            if (token != null)
            {
                _context.Tokens.Remove(token);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RevokeRefreshTokensUserAsync(Guid userId, string currentClientSecret)
        {
            var tokens = await _context.Tokens
                .Where(t => t.UserId == userId && t.ClientSecret != currentClientSecret)
                .ToListAsync();
            _context.Tokens.RemoveRange(tokens);
            await _context.SaveChangesAsync();
        }
    }
}