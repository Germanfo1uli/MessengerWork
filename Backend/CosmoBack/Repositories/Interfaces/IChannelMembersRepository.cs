using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IChannelMembersRepository
    {
        Task AddAsync(ChannelMember channelMember);
        Task DeleteByChannelIdAsync(Guid channelId);
        Task DeleteByChannelIdAndUserIdAsync(Guid channelId, Guid userId);
        Task<ChannelMember> GetByChannelAndUserIdAsync(Guid channelId, Guid userId);
        Task UpdateAsync(ChannelMember channelMember);
    }
}