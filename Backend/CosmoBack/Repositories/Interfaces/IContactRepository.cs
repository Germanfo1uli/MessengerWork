using CosmoBack.Models;

namespace CosmoBack.Repositories.Interfaces
{
    public interface IContactRepository : IRepository<Contact>
    {
        Task<Contact> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<Contact>> GetUserContactsAsync(Guid userId);
    }
}