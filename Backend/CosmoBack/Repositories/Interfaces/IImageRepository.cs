using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IImageRepository
    {
        Task<Image> AddAsync(Image image);
        Task<Image?> GetByIdAsync(Guid id);
        Task<Image?> GetByEntityAsync(string entityType, Guid entityId);
        Task DeleteAsync(Guid id);
    }
}