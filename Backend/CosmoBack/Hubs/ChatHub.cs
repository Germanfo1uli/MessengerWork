using Microsoft.AspNetCore.SignalR;
using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Hubs
{
    public class ChatHub(IChatService chatService) : Hub
    {
        private readonly IChatService _chatService = chatService;


        // Подключение пользователя к чату
        public async Task JoinChat(Guid chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
            await Clients.Group(chatId.ToString()).SendAsync("UserJoined", Context.User?.Identity?.Name);
        }

        // Отключение пользователя от чата
        public async Task LeaveChat(Guid chatId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId.ToString());
        }

        // Отправка сообщения в чат
        public async Task SendMessage(Guid? chatId, Guid secondUserId, string message, int tempId)
        {
            var senderId = Guid.Parse(Context.User?.FindFirst("sub")?.Value
                ?? throw new UnauthorizedAccessException("Пользователь не авторизован"));

            var chatMessage = await _chatService.SendMessageAsync(chatId, senderId, secondUserId, message);

            var response = new
            {
                chatMessage.Id,
                chatMessage.ChatId,
                chatMessage.SenderId,
                chatMessage.Comment,
                chatMessage.CreatedAt,
                tempId
            };

            await Clients.Group(response.ChatId.ToString()).SendAsync("ReceiveMessage", response);

            var chat = await _chatService.GetChatByIdAsync(response.ChatId);

            // Уведомляем всех участников чата, что список чатов нужно обновить
            await Clients.Group(chatMessage.ChatId.ToString()).SendAsync("UpdateChatList");
        }
    }
}