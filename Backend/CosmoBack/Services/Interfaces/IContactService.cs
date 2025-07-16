using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface IContactService
    {
        Task<ContactDto> AddContactAsync(Guid ownerId, Guid contactId, string? tag);
        Task RemoveContactAsync(Guid contactId);
        Task<IEnumerable<UserDto>> GetUserContactsAsync(Guid userId);
        Task UpdateContactTagAsync(Guid contactId, string newTag);
    }
}