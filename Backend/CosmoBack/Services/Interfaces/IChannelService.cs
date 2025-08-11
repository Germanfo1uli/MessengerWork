using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IChannelService
    {
        Task<ChannelDto> GetChannelByIdAsync(Guid id);
        Task<IEnumerable<(ChannelDto, ImageDto?)>> GetUserChannelsAsync(Guid userId);
        Task<ChannelDto> CreateChannelAsync(Guid ownerId, string name, bool isPublic, string? channelTag, string? description, Guid? avatarImageId);
        Task DeleteChannelAsync(Guid channelId);
        Task<ChannelDto> ToggleFavoriteChannelAsync(Guid channelId, Guid userId, bool favorite);
        Task<ChannelMessageDto> SendChannelMessageAsync(Guid channelId, Guid senderId, string comment); 
    }
}