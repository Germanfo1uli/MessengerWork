using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class TokenRepository(CosmoDbContext context) : Repository<Token>(context), ITokenRepository
    {
        public async Task RevokeRefreshTokenAsync(string token)
        {
            var tokenEntity = await _context.Set<Token>()
                .FirstOrDefaultAsync(t => t.ClientSecret == token);

            if (tokenEntity != null)
            {
                _context.Set<Token>().Remove(tokenEntity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RevokeRefreshTokensUserAsync(Guid userId, string token)
        {
            var tokensToRevoke = await _context.Set<Token>()
                .Where(t => t.UserId == userId && t.ClientSecret != token)
                .ToListAsync();

            if (tokensToRevoke.Any())
            {
                _context.Set<Token>().RemoveRange(tokensToRevoke);
                await _context.SaveChangesAsync();
            }
        }
    }
}