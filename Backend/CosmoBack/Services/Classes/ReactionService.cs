using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CosmoBack.Services.Classes
{
    public class ReactionService : IReactionService
    {
        private readonly IReactionRepository _reactionRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly CosmoDbContext _context;
        private readonly ILogger<ReactionService> _logger;

        public ReactionService(
            IReactionRepository reactionRepository,
            IMessageRepository messageRepository,
            IUserRepository userRepository,
            IHttpContextAccessor httpContextAccessor,
            CosmoDbContext context,
            ILogger<ReactionService> logger)
        {
            _reactionRepository = reactionRepository;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _logger = logger;
        }

        public async Task<ReactionDto> AddReactionAsync(Guid messageId, Guid userId, string emoji)
        {
            _logger.LogInformation("Adding reaction to message {MessageId} by user {UserId}", messageId, userId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (userId != currentUserId)
                    throw new UnauthorizedAccessException("Недостаточно прав");

                var message = await _messageRepository.GetByIdAsync(messageId);
                if (message == null)
                    throw new KeyNotFoundException($"Сообщение с ID {messageId} не найдено");

                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                    throw new KeyNotFoundException($"Пользователь с ID {userId} не найден");

                if (emoji.Length > 20)
                    throw new ArgumentException("Эмодзи превышает допустимую длину");

                var reaction = new Reaction
                {
                    Id = Guid.NewGuid(),
                    MessageId = messageId,
                    UserId = userId,
                    Emoji = emoji,
                    CreatedAt = DateTime.UtcNow
                };

                await _reactionRepository.AddAsync(reaction);

                return new ReactionDto
                {
                    Id = reaction.Id,
                    UserId = userId,
                    Username = user.Username,
                    Emoji = reaction.Emoji,
                    CreatedAt = reaction.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding reaction to message {MessageId}", messageId);
                throw new Exception($"Ошибка при добавлении реакции: {ex.Message}", ex);
            }
        }

        public async Task DeleteReactionAsync(Guid reactionId, Guid userId)
        {
            _logger.LogInformation("Deleting reaction {ReactionId} by user {UserId}", reactionId, userId);
            try
            {
                var currentUserId = Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));
                if (userId != currentUserId)
                    throw new UnauthorizedAccessException("Недостаточно прав: пользователь не совпадает с текущим");

                var reaction = await _context.Reactions
                    .Where(r => r.Id == reactionId)
                    .FirstOrDefaultAsync();
                if (reaction == null)
                {
                    _logger.LogWarning("Reaction {ReactionId} not found", reactionId);
                    throw new KeyNotFoundException($"Реакция с ID {reactionId} не найдена");
                }
                if (reaction.UserId != userId)
                {
                    _logger.LogWarning("User {UserId} is not authorized to delete reaction {ReactionId} owned by {ReactionUserId}", userId, reactionId, reaction.UserId);
                    throw new UnauthorizedAccessException("Недостаточно прав: реакция принадлежит другому пользователю");
                }

                var deleted = await _reactionRepository.DeleteAsync(reactionId, userId);
                if (!deleted)
                {
                    _logger.LogWarning("Failed to delete reaction {ReactionId} by user {UserId}", reactionId, userId);
                    throw new KeyNotFoundException($"Реакция с ID {reactionId} не найдена");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting reaction {ReactionId}", reactionId);
                throw new Exception($"Ошибка при удалении реакции: {ex.Message}", ex);
            }
        }
    }
}