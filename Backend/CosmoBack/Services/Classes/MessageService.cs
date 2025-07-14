using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using CosmoBack.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CosmoBack.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;

        public MessageService(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository ?? throw new ArgumentNullException(nameof(messageRepository));
        }

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

        public async Task<IEnumerable<Message>> GetMessagesByChatAsync(Guid chatId)
        {
            try
            {
                return await _messageRepository.GetMessagesByChatIdAsync(chatId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении сообщений чата: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Message>> GetMessagesByGroupAsync(Guid groupId)
        {
            try
            {
                return await _messageRepository.GetMessagesByGroupIdAsync(groupId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при получении сообщений группы: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Message>> GetMessagesByChannelAsync(Guid channelId)
        {
            try
            {
                return await _messageRepository.GetMessagesByChannelIdAsync(channelId);
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