using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class GroupMembersService(
        IGroupRepository groupRepository,
        IGroupMembersRepository groupMembersRepository,
        IUserRepository userRepository,
        ILogger<GroupMembersService> logger) : IGroupMembersService
    {
        private readonly IGroupRepository _groupRepository = groupRepository;
        private readonly IGroupMembersRepository _groupMembersRepository = groupMembersRepository;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ILogger<GroupMembersService> _logger = logger;

        public async Task AddMemberAsync(Guid groupId, Guid userId, GroupRole role)
        {
            _logger.LogInformation("Adding user {UserId} to group {GroupId} with role {Role}", userId, groupId, role);
            try
            {
                var group = await _groupRepository.GetGroupByIdWithMessagesAsync(groupId);
                if (group == null)
                {
                    _logger.LogWarning("Group {GroupId} not found", groupId);
                    throw new KeyNotFoundException($"Группа с ID {groupId} не найдена");
                }

                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User {UserId} not found", userId);
                    throw new KeyNotFoundException($"Пользователь с ID {userId} не найден");
                }

                if (group.Members.Any(m => m.UserId == userId))
                {
                    _logger.LogWarning("User {UserId} is already a member of group {GroupId}", userId, groupId);
                    throw new InvalidOperationException("Пользователь уже является участником группы");
                }

                var groupMember = new GroupMember
                {
                    Id = Guid.NewGuid(),
                    GroupId = groupId,
                    UserId = userId,
                    Role = role,
                    Notifications = true
                };

                await _groupMembersRepository.AddAsync(groupMember);
                _logger.LogInformation("User {UserId} added to group {GroupId}", userId, groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding user {UserId} to group {GroupId}", userId, groupId);
                throw new Exception($"Ошибка при добавлении участника: {ex.Message}", ex);
            }
        }

        public async Task RemoveMemberAsync(Guid groupId, Guid userId)
        {
            _logger.LogInformation("Removing user {UserId} from group {GroupId}", userId, groupId);
            try
            {
                var group = await _groupRepository.GetGroupByIdWithMessagesAsync(groupId);
                if (group == null)
                {
                    _logger.LogWarning("Group {GroupId} not found", groupId);
                    throw new KeyNotFoundException($"Группа с ID {groupId} не найдена");
                }

                var member = group.Members.FirstOrDefault(m => m.UserId == userId);
                if (member == null)
                {
                    _logger.LogWarning("User {UserId} is not a member of group {GroupId}", userId, groupId);
                    throw new KeyNotFoundException($"Пользователь с ID {userId} не является участником группы");
                }

                if (member.Role == GroupRole.Owner)
                {
                    _logger.LogWarning("Cannot remove owner {UserId} from group {GroupId}", userId, groupId);
                    throw new InvalidOperationException("Нельзя удалить владельца группы");
                }

                await _groupMembersRepository.DeleteByGroupIdAsync(groupId);
                _logger.LogInformation("User {UserId} removed from group {GroupId}", userId, groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing user {UserId} from group {GroupId}", userId, groupId);
                throw new Exception($"Ошибка при удалении участника: {ex.Message}", ex);
            }
        }
    }
}