using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IImageService
    {
        Task<ImageDto> UploadAvatarAsync(Guid entityId, string entityType, byte[] data, string fileName, string mimeType, long fileSize);
        Task<ImageDto?> GetAvatarAsync(string entityType, Guid entityId);
        Task DeleteAvatarAsync(Guid imageId);
    }
}