using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Classes;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class ReplyService(IReplyRepository replyRepository, IMessageRepository messageRepository, IUserRepository userRepository, ILogger<ChatService> logger) : IReplyService
    {
        private readonly IReplyRepository _replyRepository = replyRepository;
        private readonly IMessageRepository _messageRepository = messageRepository;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ILogger _logger = logger;

        public async Task<ChatMessageDto> CreateReplyAsync(Guid originalMessageId, string comment, Guid senderId)
        {
            try
            {
                var originalMessage = await _messageRepository.GetByIdAsync(originalMessageId)
                    ?? throw new KeyNotFoundException($"Сообщение с ID {originalMessageId} не найдено");

                var replyMessage = new Message
                {
                    Id = Guid.NewGuid(),
                    SenderId = senderId,
                    Comment = comment,
                    CreatedAt = DateTime.UtcNow,
                    ChatId = originalMessage.ChatId,
                    GroupId = originalMessage.GroupId,
                    ChannelId = originalMessage.ChannelId
                };

                await _messageRepository.AddAsync(replyMessage);

                var reply = new Reply
                {
                    OriginalMessageId = originalMessageId,
                    ReplyMessageId = replyMessage.Id,
                    CreatedAt = DateTime.UtcNow
                };

                reply = await _replyRepository.CreateReplyAsync(reply);
                var user = await _userRepository.GetByIdAsync(senderId);

                var replyDto = new MessageReplyDto
                {
                    MessageId = reply.OriginalMessageId,
                    SenderId = senderId,
                    Username = user.Username,
                    Comment = originalMessage.Comment
                };

                return new ChatMessageDto
                {
                    Id = replyMessage.Id,
                    ChatId = (Guid)originalMessage.ChatId,
                    SenderId = senderId,
                    Comment = comment,
                    CreatedAt = replyMessage.CreatedAt,
                    Username = user?.Username ?? "",
                    AvatarImageId = user?.AvatarImageId,
                    ReplyTo = replyDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании ответа на сообщение {OriginalMessageId} от пользователя {SenderId}", originalMessageId, senderId);
                throw;
            }
        }

        public async Task<IEnumerable<MessageReplyDto>> GetRepliesByMessageIdAsync(Guid messageId)
        {
            var replies = await _replyRepository.GetRepliesByMessageIdAsync(messageId);
            return replies.Select(r => new MessageReplyDto
            {
                MessageId = r.ReplyMessageId,
                SenderId = r.ReplyMessage.SenderId,
                Username = r.ReplyMessage.Sender?.Username ?? "",
                Comment = r.ReplyMessage.Comment
            });
        }
    }
}