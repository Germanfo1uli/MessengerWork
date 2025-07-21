using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;

namespace CosmoBack.Services.Classes
{
    public class ReplyService(IReplyRepository replyRepository, IMessageRepository messageRepository, CosmoDbContext context) : IReplyService
    {
        private readonly IReplyRepository _replyRepository = replyRepository;
        private readonly IMessageRepository _messageRepository = messageRepository;
        private readonly CosmoDbContext _context = context;

        public async Task<BaseMessageDto> CreateReplyAsync(Guid originalMessageId, string comment, Guid senderId)
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

            await _replyRepository.CreateReplyAsync(reply);

            var user = await _context.Users.FindAsync(senderId);
            return new BaseMessageDto
            {
                Id = replyMessage.Id,
                SenderId = senderId,
                Comment = comment,
                CreatedAt = replyMessage.CreatedAt,
                Username = user?.Username ?? "",
                AvatarImageId = user?.AvatarImageId
            };
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