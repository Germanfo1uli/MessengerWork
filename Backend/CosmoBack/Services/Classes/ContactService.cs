using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace CosmoBack.Services.Classes
{
    public class ContactService(IContactRepository contactRepository, IUserRepository userRepository, CosmoDbContext context, ILogger<ContactService> logger) : IContactService
    {
        private readonly IContactRepository _contactRepository = contactRepository ?? throw new ArgumentNullException(nameof(contactRepository));
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly CosmoDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<ContactService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

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

        public async Task<IEnumerable<UserDto>> GetUserContactsAsync(Guid userId)
        {
            _logger.LogInformation("Getting contacts for user {UserId}", userId);
            try
            {
                var contactIds = await _context.Contacts
                    .Where(c => c.OwnerId == userId)
                    .Select(c => c.ContactId)
                    .ToListAsync();

                _logger.LogInformation("Found {ContactCount} contacts for user {UserId}", contactIds.Count, userId);

                var users = new List<UserDto>();
                foreach (var contactId in contactIds)
                {
                    var user = await _userRepository.GetByIdAsync(contactId);
                    if (user != null)
                    {
                        users.Add(new UserDto
                        {
                            Id = user.Id,
                            Username = user.Username,
                            Phone = user.Phone,
                            PasswordHash = user.PasswordHash,
                            CreatedAt = user.CreatedAt,
                            Bio = user.Bio,
                            AvatarImageId = user.AvatarImageId,
                            LastSeen = user.LastSeen,
                            IsActive = user.IsActive,
                            PublicName = user.PublicName,
                            OnlineStatus = user.OnlineStatus,
                            Theme = user.Theme
                        });
                    }
                    else
                    {
                        _logger.LogWarning("User with ID {ContactId} not found for contact of user {UserId}", contactId, userId);
                    }
                }

                _logger.LogInformation("Retrieved {UserCount} user details for contacts of user {UserId}", users.Count, userId);
                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving contacts for user {UserId}", userId);
                throw new Exception($"Ошибка при получении контактов пользователя: {ex.Message}", ex);
            }
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