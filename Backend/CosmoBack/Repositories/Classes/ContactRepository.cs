using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ContactRepository(CosmoDbContext context) : Repository<Contact>(context), IContactRepository
    {
        public async Task<Contact> GetByUserIdAsync(Guid userId)
        {
            return await _context.Set<Contact>()
                .FirstOrDefaultAsync(c => c.OwnerId == userId);
        }
    }
}