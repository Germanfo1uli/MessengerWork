using CosmoBack.Models;

namespace CosmoBack.Services.Interfaces
{
    public interface IContactService
    {
        Task<Contact> AddContactAsync(Guid ownerId, Guid contactId, string tag = null);
        Task RemoveContactAsync(Guid contactId);
        Task<IEnumerable<Contact>> GetUserContactsAsync(Guid userId);
        Task UpdateContactTagAsync(Guid contactId, string newTag);
    }
}