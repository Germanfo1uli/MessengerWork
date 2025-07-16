using Microsoft.AspNetCore.SignalR;
using CosmoBack.Models.Dtos;
using CosmoBack.Services.Interfaces;

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
        public async Task SendMessage(Guid chatId, Guid senderId, string message)
        {
            var chatMessage = await _chatService.SendMessageAsync(chatId, senderId, message);

            await Clients.Group(chatId.ToString()).SendAsync("ReceiveMessage", chatMessage);

            // Уведомляем всех участников чата, что список чатов нужно обновить
            await Clients.Group(chatId.ToString()).SendAsync("UpdateChatList");
        }
    }
}