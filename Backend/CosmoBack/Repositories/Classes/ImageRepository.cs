using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ImageRepository(CosmoDbContext context) : IImageRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<Image> AddAsync(Image image)
        {
            await _context.Images.AddAsync(image);
            await _context.SaveChangesAsync();
            return image;
        }

        public async Task<Image?> GetByIdAsync(Guid id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task<Image?> GetByEntityAsync(string entityType, Guid entityId)
        {
            return await _context.Images
                .FirstOrDefaultAsync(i => i.EntityType == entityType && i.EntityId == entityId);
        }

        public async Task DeleteAsync(Guid id)
        {
            var image = await GetByIdAsync(id);
            if (image != null)
            {
                _context.Images.Remove(image);
                await _context.SaveChangesAsync();
            }
        }
    }
}