using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CosmoBack.Services.Classes
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        private readonly IUserRepository _userRepository;
        private readonly IChatService _chatService;
        private readonly CosmoDbContext _context;
        private readonly ILogger<ContactService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContactService(
            IContactRepository contactRepository,
            IUserRepository userRepository,
            IChatService chatService,
            CosmoDbContext context,
            ILogger<ContactService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _contactRepository = contactRepository;
            _userRepository = userRepository;
            _chatService = chatService;
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ContactDto> AddContactAsync(Guid ownerId, Guid contactId, string? tag)
        {
            _logger.LogInformation("Adding contact for owner {OwnerId} with contact {ContactId}", ownerId, contactId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (ownerId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to add contact as owner {OwnerId}", currentUserId, ownerId);
                    throw new UnauthorizedAccessException("Недостаточно прав для добавления контакта от имени другого пользователя");
                }

                if (ownerId == contactId)
                {
                    _logger.LogWarning("Attempt to add self as contact for user {OwnerId}", ownerId);
                    throw new InvalidOperationException("Нельзя добавить себя в контакты");
                }

                var owner = await _userRepository.GetByIdAsync(ownerId);
                if (owner == null)
                {
                    _logger.LogWarning("Owner {OwnerId} not found", ownerId);
                    throw new KeyNotFoundException("Владелец контакта не найден");
                }

                var contactUser = await _userRepository.GetByIdAsync(contactId);
                if (contactUser == null)
                {
                    _logger.LogWarning("Contact user {ContactId} not found", contactId);
                    throw new KeyNotFoundException("Пользователь для добавления в контакты не найден");
                }

                if (await _context.Contacts.AnyAsync(c => c.OwnerId == ownerId && c.ContactId == contactId))
                {
                    _logger.LogWarning("Contact already exists for owner {OwnerId} and contact {ContactId}", ownerId, contactId);
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

                try
                {
                    await _chatService.CreateChatAsync(ownerId, contactId);
                    _logger.LogInformation("Chat created successfully between users {OwnerId} and {ContactId}", ownerId, contactId);
                }
                catch (InvalidOperationException ex) when (ex.Message.Contains("Чат между пользователями уже существует"))
                {
                    _logger.LogInformation("Chat already exists between users {OwnerId} and {ContactId}", ownerId, contactId);
                }

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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding contact for owner {OwnerId} with contact {ContactId}", ownerId, contactId);
                throw new Exception($"Ошибка при добавлении контакта: {ex.Message}", ex);
            }
        }

        public async Task RemoveContactAsync(Guid contactId)
        {
            _logger.LogInformation("Removing contact with ID {ContactId}", contactId);
            try
            {
                var contact = await _contactRepository.GetByIdAsync(contactId);
                if (contact == null)
                {
                    _logger.LogWarning("Contact with ID {ContactId} not found", contactId);
                    throw new KeyNotFoundException("Контакт не найден");
                }

                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (contact.OwnerId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to remove contact {ContactId}", currentUserId, contactId);
                    throw new UnauthorizedAccessException("Недостаточно прав для удаления контакта");
                }

                await _contactRepository.DeleteAsync(contactId);
                _logger.LogInformation("Contact {ContactId} removed successfully", contactId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing contact with ID {ContactId}", contactId);
                throw new Exception($"Ошибка при удалении контакта: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<UserDto>> GetUserContactsAsync(Guid userId)
        {
            _logger.LogInformation("Getting contacts for user {UserId}", userId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (userId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to access contacts for user {RequestedUserId}", currentUserId, userId);
                    throw new UnauthorizedAccessException("Недостаточно прав для получения контактов другого пользователя");
                }

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
            _logger.LogInformation("Updating tag for contact {ContactId}", contactId);
            try
            {
                var contact = await _contactRepository.GetByIdAsync(contactId);
                if (contact == null)
                {
                    _logger.LogWarning("Contact with ID {ContactId} not found", contactId);
                    throw new KeyNotFoundException("Контакт не найден");
                }

                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (contact.OwnerId != currentUserId)
                {
                    _logger.LogWarning("User {CurrentUserId} is not authorized to update tag for contact {ContactId}", currentUserId, contactId);
                    throw new UnauthorizedAccessException("Недостаточно прав для обновления тега контакта");
                }

                contact.ContactTag = newTag;
                await _contactRepository.UpdateAsync(contact);
                _logger.LogInformation("Tag updated for contact {ContactId}", contactId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tag for contact {ContactId}", contactId);
                throw new Exception($"Ошибка при обновлении тега контакта: {ex.Message}", ex);
            }
        }
    }
}