using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Models.Dtos;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Services
{
    public class MessageService(IMessageRepository messageRepository, CosmoDbContext context) : IMessageService
    {
        private readonly IMessageRepository _messageRepository = messageRepository;
        private readonly CosmoDbContext _context = context;

        public async Task<Message> GetMessageByIdAsync(Guid id)
        {
            try
            {
                var message = await _messageRepository.GetByIdAsync(id);
                if (message == null)
                {
                    throw new KeyNotFoundException($"Сообщение с ID {id} не найдено");
                }
                return message;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении сообщения: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<ChatMessageDto>> GetMessagesByChatAsync(Guid chatId)
        {
            try
            {
                var messages = await _context.Messages
                    .Where(m => m.ChatId == chatId)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new { Message = m, User = u })
                    .GroupJoin(_context.Replies,
                        mu => mu.Message.Id,
                        r => r.ReplyMessageId, // Изменено: присоединяем по ReplyMessageId
                        (mu, replies) => new { mu.Message, mu.User, Replies = replies })
                    .SelectMany(
                        mur => mur.Replies.DefaultIfEmpty(),
                        (mur, r) => new { mur.Message, mur.User, Reply = r })
                    .GroupBy(x => x.Message.Id)
                    .Select(g => new ChatMessageDto
                    {
                        Id = g.First().Message.Id,
                        ChatId = (Guid)g.First().Message.ChatId,
                        SenderId = g.First().Message.SenderId,
                        Comment = g.First().Message.Comment,
                        CreatedAt = g.First().Message.CreatedAt,
                        Username = g.First().User.Username,
                        AvatarImageId = g.First().User.AvatarImageId,
                        ReplyTo = g.Where(x => x.Reply != null)
                            .Select(x => new MessageReplyDto
                            {
                                MessageId = x.Reply.OriginalMessageId,
                                SenderId = x.Reply.OriginalMessage.SenderId,
                                Username = x.Reply.OriginalMessage.Sender.Username,
                                Comment = x.Reply.OriginalMessage.Comment
                            })
                            .FirstOrDefault()
                    })
                    .OrderBy(m => m.CreatedAt)
                    .ToListAsync();

                return messages;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении сообщений чата: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<GroupMessageDto>> GetMessagesByGroupAsync(Guid groupId)
        {
            try
            {
                var messages = await _context.Messages
                    .Where(m => m.GroupId == groupId)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new { Message = m, User = u })
                    .GroupJoin(_context.Replies,
                        mu => mu.Message.Id,
                        r => r.ReplyMessageId, // Изменено: присоединяем по ReplyMessageId
                        (mu, replies) => new { mu.Message, mu.User, Replies = replies })
                    .SelectMany(
                        mur => mur.Replies.DefaultIfEmpty(),
                        (mur, r) => new { mur.Message, mur.User, Reply = r })
                    .GroupBy(x => x.Message.Id)
                    .Select(g => new GroupMessageDto
                    {
                        Id = g.First().Message.Id,
                        GroupId = g.First().Message.GroupId,
                        SenderId = g.First().Message.SenderId,
                        Comment = g.First().Message.Comment,
                        CreatedAt = g.First().Message.CreatedAt,
                        Username = g.First().User.Username,
                        AvatarImageId = g.First().User.AvatarImageId,
                        ReplyTo = g.Where(x => x.Reply != null)
                            .Select(x => new MessageReplyDto
                            {
                                MessageId = x.Reply.OriginalMessageId,
                                SenderId = x.Reply.OriginalMessage.SenderId,
                                Username = x.Reply.OriginalMessage.Sender.Username,
                                Comment = x.Reply.OriginalMessage.Comment
                            })
                            .FirstOrDefault()
                    })
                    .OrderBy(m => m.CreatedAt)
                    .ToListAsync();

                return messages;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении сообщений группы: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<ChannelMessageDto>> GetMessagesByChannelAsync(Guid channelId)
        {
            try
            {
                var messages = await _context.Messages
                    .Where(m => m.ChannelId == channelId)
                    .Join(_context.Users,
                        m => m.SenderId,
                        u => u.Id,
                        (m, u) => new { Message = m, User = u })
                    .GroupJoin(_context.Replies,
                        mu => mu.Message.Id,
                        r => r.ReplyMessageId, // Изменено: присоединяем по ReplyMessageId
                        (mu, replies) => new { mu.Message, mu.User, Replies = replies })
                    .SelectMany(
                        mur => mur.Replies.DefaultIfEmpty(),
                        (mur, r) => new { mur.Message, mur.User, Reply = r })
                    .GroupBy(x => x.Message.Id)
                    .Select(g => new ChannelMessageDto
                    {
                        Id = g.First().Message.Id,
                        ChannelId = g.First().Message.ChannelId,
                        SenderId = g.First().Message.SenderId,
                        Comment = g.First().Message.Comment,
                        CreatedAt = g.First().Message.CreatedAt,
                        Username = g.First().User.Username,
                        AvatarImageId = g.First().User.AvatarImageId,
                        ReplyTo = g.Where(x => x.Reply != null)
                            .Select(x => new MessageReplyDto
                            {
                                MessageId = x.Reply.OriginalMessageId,
                                SenderId = x.Reply.OriginalMessage.SenderId,
                                Username = x.Reply.OriginalMessage.Sender.Username,
                                Comment = x.Reply.OriginalMessage.Comment
                            })
                            .FirstOrDefault()
                    })
                    .OrderBy(m => m.CreatedAt)
                    .ToListAsync();

                return messages;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении сообщений канала: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Message>> GetMessagesBySenderAsync(Guid senderId)
        {
            try
            {
                return await _messageRepository.GetMessagesBySenderIdAsync(senderId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении сообщений отправителя: {ex.Message}", ex);
            }
        }

        public async Task<Message> CreateMessageAsync(Message message)
        {
            try
            {
                message.CreatedAt = DateTime.UtcNow;
                await _messageRepository.AddAsync(message);
                return await GetMessageByIdAsync(message.Id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при создании сообщения: {ex.Message}", ex);
            }
        }

        public async Task DeleteMessageAsync(Guid messageId)
        {
            try
            {
                await _messageRepository.DeleteAsync(messageId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при удалении сообщения: {ex.Message}", ex);
            }
        }

        public async Task<Message> UpdateMessageAsync(Guid messageId, string newContent)
        {
            try
            {
                var message = await _messageRepository.GetByIdAsync(messageId);
                if (message == null)
                {
                    throw new KeyNotFoundException($"Сообщение с ID {messageId} не найдено");
                }

                message.Comment = newContent;
                message.CreatedAt = DateTime.UtcNow;
                await _messageRepository.UpdateAsync(message);
                return await GetMessageByIdAsync(messageId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при обновлении сообщения: {ex.Message}", ex);
            }
        }
    }
}