using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Services.Classes
{
    public class ImageService(IImageRepository imageRepository, CosmoDbContext context, ILogger<ImageService> logger) : IImageService
    {
        private readonly IImageRepository _imageRepository = imageRepository;
        private readonly CosmoDbContext _context = context;
        private readonly ILogger<ImageService> _logger = logger;

        public async Task<ImageDto> UploadAvatarAsync(Guid entityId, string entityType, byte[] data, string fileName, string mimeType, long fileSize)
        {
            _logger.LogInformation("Uploading avatar for entity {EntityType} with ID {EntityId}", entityType, entityId);
            try
            {
                if (string.IsNullOrEmpty(entityType) || !new[] { "User", "Group", "Channel" }.Contains(entityType))
                {
                    throw new ArgumentException("Недопустимый тип сущности");
                }

                bool entityExists = entityType switch
                {
                    "User" => await _context.Users.AnyAsync(u => u.Id == entityId),
                    "Group" => await _context.Groups.AnyAsync(g => g.Id == entityId),
                    "Channel" => await _context.Channels.AnyAsync(c => c.Id == entityId),
                    _ => false
                };

                if (!entityExists)
                {
                    _logger.LogWarning("Entity {EntityType} with ID {EntityId} not found", entityType, entityId);
                    throw new KeyNotFoundException($"Сущность {entityType} с ID {entityId} не найдена");
                }

                var existingAvatar = await _imageRepository.GetByEntityAsync(entityType, entityId);
                if (existingAvatar != null)
                {
                    await _imageRepository.DeleteAsync(existingAvatar.Id);
                }

                var image = new Image
                {
                    Id = Guid.NewGuid(),
                    FileName = fileName,
                    MimeType = mimeType,
                    FileSize = fileSize,
                    Data = data,
                    EntityType = entityType,
                    EntityId = entityId,
                    UploadDate = DateTime.UtcNow
                };

                await _imageRepository.AddAsync(image);

                switch (entityType)
                {
                    case "User":
                        var user = await _context.Users.FindAsync(entityId);
                        if (user != null)
                        {
                            user.AvatarImageId = image.Id;
                            await _context.SaveChangesAsync();
                        }
                        break;
                    case "Group":
                        var group = await _context.Groups.FindAsync(entityId);
                        if (group != null)
                        {
                            group.AvatarImageId = image.Id;
                            await _context.SaveChangesAsync();
                        }
                        break;
                    case "Channel":
                        var channel = await _context.Channels.FindAsync(entityId);
                        if (channel != null)
                        {
                            channel.AvatarImageId = image.Id;
                            await _context.SaveChangesAsync();
                        }
                        break;
                }

                var imageDto = new ImageDto
                {
                    Id = image.Id,
                    FileName = image.FileName,
                    MimeType = image.MimeType,
                    FileSize = image.FileSize,
                    Data = image.Data,
                    EntityType = image.EntityType,
                    EntityId = image.EntityId,
                    UploadDate = image.UploadDate,
                    Url = image.Url
                };

                _logger.LogInformation("Avatar uploaded successfully for entity {EntityType} with ID {EntityId}", entityType, entityId);
                return imageDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading avatar for entity {EntityType} with ID {EntityId}", entityType, entityId);
                throw new Exception($"Ошибка при загрузке аватара: {ex.Message}", ex);
            }
        }

        public async Task<ImageDto?> GetAvatarAsync(string entityType, Guid entityId)
        {
            _logger.LogInformation("Retrieving avatar for entity {EntityType} with ID {EntityId}", entityType, entityId);
            try
            {
                var image = await _imageRepository.GetByEntityAsync(entityType, entityId);
                if (image == null)
                {
                    _logger.LogWarning("Avatar not found for entity {EntityType} with ID {EntityId}", entityType, entityId);
                    return null;
                }

                return new ImageDto
                {
                    Id = image.Id,
                    FileName = image.FileName,
                    MimeType = image.MimeType,
                    FileSize = image.FileSize,
                    Data = image.Data,
                    EntityType = image.EntityType,
                    EntityId = image.EntityId,
                    UploadDate = image.UploadDate,
                    Url = image.Url
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving avatar for entity {EntityType} with ID {EntityId}", entityType, entityId);
                throw new Exception($"Ошибка при получении аватара: {ex.Message}", ex);
            }
        }

        public async Task DeleteAvatarAsync(Guid imageId)
        {
            _logger.LogInformation("Deleting avatar with ID {ImageId}", imageId);
            try
            {
                var image = await _imageRepository.GetByIdAsync(imageId);
                if (image == null)
                {
                    _logger.LogWarning("Avatar with ID {ImageId} not found", imageId);
                    throw new KeyNotFoundException($"Аватар с ID {imageId} не найден");
                }

                switch (image.EntityType)
                {
                    case "User":
                        var user = await _context.Users.FindAsync(image.EntityId);
                        if (user != null)
                        {
                            user.AvatarImageId = null;
                            await _context.SaveChangesAsync();
                        }
                        break;
                    case "Group":
                        var group = await _context.Groups.FindAsync(image.EntityId);
                        if (group != null)
                        {
                            group.AvatarImageId = null;
                            await _context.SaveChangesAsync();
                        }
                        break;
                    case "Channel":
                        var channel = await _context.Channels.FindAsync(image.EntityId);
                        if (channel != null)
                        {
                            channel.AvatarImageId = null;
                            await _context.SaveChangesAsync();
                        }
                        break;
                }

                await _imageRepository.DeleteAsync(imageId);
                _logger.LogInformation("Avatar with ID {ImageId} deleted successfully", imageId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting avatar with ID {ImageId}", imageId);
                throw new Exception($"Ошибка при удалении аватара: {ex.Message}", ex);
            }
        }
    }
}