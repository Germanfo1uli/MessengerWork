using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace CosmoBack.Services.Classes
{
    public class ContactService(IContactRepository contactRepository, IUserRepository userRepository, CosmoDbContext context) : IContactService
    {
        private readonly IContactRepository _contactRepository = contactRepository ?? throw new ArgumentNullException(nameof(contactRepository));
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly CosmoDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<ContactDto> AddContactAsync(Guid ownerId, Guid contactId, string? tag)
        {
            if (ownerId == contactId)
            {
                throw new InvalidOperationException("Нельзя добавить себя в контакты");
            }

            var owner = await _userRepository.GetByIdAsync(ownerId);
            if (owner == null)
            {
                throw new KeyNotFoundException("Владелец контакта не найден");
            }

            var contactUser = await _userRepository.GetByIdAsync(contactId);
            if (contactUser == null)
            {
                throw new KeyNotFoundException("Пользователь для добавления в контакты не найден");
            }

            if (await _context.Contacts.AnyAsync(c => c.OwnerId == ownerId && c.ContactId == contactId))
            {
                throw new InvalidOperationException("Контакт уже существует");
            }

            var contact = new Contact
            {
                Id = Guid.NewGuid(),
                OwnerId = ownerId,
                ContactId = contactId,
                ContactTag = tag
            };

            await _contactRepository.AddAsync(contact);

            return new ContactDto
            {
                Id = contact.Id,
                OwnerId = contact.OwnerId,
                ContactId = contact.ContactId,
                ContactUsername = contactUser.Username,
                ContactPhone = contactUser.Phone,
                Tag = contact.ContactTag
            };
        }

        public async Task RemoveContactAsync(Guid contactId)
        {
            var contact = await _contactRepository.GetByIdAsync(contactId);
            if (contact == null)
            {
                throw new KeyNotFoundException("Контакт не найден");
            }

            await _contactRepository.DeleteAsync(contactId);
        }

        public async Task<List<ContactDto>> GetUserContactsAsync(Guid userId)
        {
            var contacts = await _context.Contacts
                .Where(c => c.OwnerId == userId)
                .Join(
                    _context.Users,
                    contact => contact.ContactId,
                    user => user.Id,
                    (contact, user) => new ContactDto
                    {
                        Id = contact.Id,
                        OwnerId = contact.OwnerId,
                        ContactId = contact.ContactId,
                        ContactUsername = user.Username,
                        ContactPhone = user.Phone,
                        Tag = contact.ContactTag
                    })
                .ToListAsync();

            return contacts;
        }

        public async Task UpdateContactTagAsync(Guid contactId, string newTag)
        {
            var contact = await _contactRepository.GetByIdAsync(contactId);
            if (contact == null)
            {
                throw new KeyNotFoundException("Контакт не найден");
            }

            contact.ContactTag = newTag;
            await _contactRepository.UpdateAsync(contact);
        }
    }
}