using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface INotificationsRepository : IRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetAllByUserIdAsync(Guid userId);
    }
}