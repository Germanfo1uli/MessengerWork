using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        private readonly IUserRepository _userRepository;

        public ContactService(IContactRepository contactRepository, IUserRepository userRepository)
        {
            _contactRepository = contactRepository ?? throw new ArgumentNullException(nameof(contactRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        public async Task<Contact> AddContactAsync(Guid ownerId, Guid contactId, string? tag = null)
        {
            try
            {
                if (ownerId == contactId)
                {
                    throw new InvalidOperationException("Нельзя добавить себя в контакты");
                }

                var owner = await _userRepository.GetByIdAsync(ownerId);
                var contactUser = await _userRepository.GetByIdAsync(contactId);

                if (owner == null || contactUser == null)
                {
                    throw new KeyNotFoundException("Один или оба пользователя не найдены");
                }

                var existingContact = await _contactRepository.GetByUserIdAsync(ownerId);
                if (existingContact != null && existingContact.ContactId == contactId)
                {
                    throw new InvalidOperationException("Контакт уже существует");
                }

                var contact = new Contact
                {
                    OwnerId = ownerId,
                    ContactId = contactId,
                    ContactTag = tag,
                    CreatedAt = DateTime.UtcNow
                };

                await _contactRepository.AddAsync(contact);
                return contact;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при добавлении контакта: {ex.Message}", ex);
            }
        }

        public async Task RemoveContactAsync(Guid contactId)
        {
            try
            {
                await _contactRepository.DeleteAsync(contactId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при удалении контакта: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Contact>> GetUserContactsAsync(Guid userId)
        {
            try
            {
                return await _contactRepository.GetUserContactsAsync(userId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении контактов пользователя: {ex.Message}", ex);
            }
        }

        public async Task UpdateContactTagAsync(Guid contactId, string newTag)
        {
            try
            {
                var contact = await _contactRepository.GetByIdAsync(contactId);
                if (contact == null)
                {
                    throw new KeyNotFoundException($"Контакт с ID {contactId} не найден");
                }

                contact.ContactTag = newTag;
                await _contactRepository.UpdateAsync(contact);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при обновлении тега контакта: {ex.Message}", ex);
            }
        }
    }
}