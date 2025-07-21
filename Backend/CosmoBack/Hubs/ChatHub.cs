using Microsoft.AspNetCore.SignalR;
using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using CosmoBack.Models;
using System.Collections.Concurrent;

namespace CosmoBack.Hubs
{
    public class ChatHub(IChatService chatService, IHttpContextAccessor httpContextAccessor) : Hub
    {
        private readonly IChatService _chatService = chatService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private static readonly ConcurrentDictionary<string, string> UserConnections = new();

        // При подключении клиента сохраняем его ConnectionId
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                UserConnections[userId] = Context.ConnectionId;
            }
            await base.OnConnectedAsync();
        }

        // При отключении клиента удаляем его ConnectionId
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                UserConnections.TryRemove(userId, out _);
            }
            await base.OnDisconnectedAsync(exception);
        }

        // Подключение пользователя к чату
        public async Task JoinChat(Guid chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
        }

        // Отключение пользователя от чата
        public async Task LeaveChat(Guid chatId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId.ToString());
        }

        // Отправка сообщения в чат
        public async Task<Guid> SendMessage(Guid? chatId, Guid secondUserId, string message, int tempId)
        {
            var senderId = Guid.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));

            var chatMessage = await _chatService.SendMessageAsync(chatId, senderId, secondUserId, message);
            var chat = await _chatService.GetChatByIdAsync(chatMessage.ChatId);

            // Добавляем отправителя в группу чата
            await Groups.AddToGroupAsync(Context.ConnectionId, chatMessage.ChatId.ToString());

            // Добавляем получателя в группу чата, если он онлайн
            if (UserConnections.TryGetValue(secondUserId.ToString(), out var secondUserConnectionId))
            {
                await Groups.AddToGroupAsync(secondUserConnectionId, chatMessage.ChatId.ToString());
            }

            var response = new
            {
                chatMessage.Id,
                chatMessage.ChatId,
                chatMessage.SenderId,
                chatMessage.Comment,
                chatMessage.CreatedAt,
                tempId
            };

            // Отправляем сообщение всем участникам чата
            await Clients.Group(chatMessage.ChatId.ToString()).SendAsync("ReceiveMessage", response);

            // Уведомляем всех участников чата об обновлении списка чатов
            await Clients.Group(chatMessage.ChatId.ToString()).SendAsync("UpdateChatList", chat);
            return chat.Id;
        }
    }
}