using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class UserRepository(CosmoDbContext context) : Repository<User>(context), IUserRepository
    {
        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByPublicnameAsync(string publicname)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.PublicName == publicname);
        }

        public async Task<User?> GetByPhoneAsync(string phone)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Phone == phone);
        }
    }
}
