using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IChannelRepository
    {
        Task<Channel> GetChannelByIdWithMessagesAsync(Guid id);
        Task<IEnumerable<Channel>> GetChannelsByUserIdAsync(Guid userId);
        Task CreateChannelAsync(Channel channel);
        Task DeleteChannelAsync(Guid id);
        Task<bool> ChannelExistsAsync(string name, Guid ownerId);
    }
}