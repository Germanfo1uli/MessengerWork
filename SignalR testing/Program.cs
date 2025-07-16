using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        // URL вашего SignalR хаба
        var hubConnection = new HubConnectionBuilder()
            .WithUrl("https://localhost:7001/chatHub", options =>
            {
                options.AccessTokenProvider = () => Task.FromResult("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZmJjNjhiMy0yZjIxLTRlNWUtYWRjZS00NDIzZTM4OGVlMjgiLCJ1c2VybmFtZSI6IlppcmFnb24iLCJuYmYiOjE3NTI2NTYyNjMsImV4cCI6MTc1NDcyOTg2MywiaWF0IjoxNzUyNjU2MjYzfQ.uxzNN9cjj7nttgT84N_SYhXRdJ9ziSr_CoU1qGZth94"); // Замените на реальный токен
            })
            .Build();

        // Обработчики событий от сервера
        hubConnection.On<object>("ReceiveMessage", message =>
        {
            Console.WriteLine($"Получено сообщение: {message}");
        });

        hubConnection.On<string>("UserJoined", user =>
        {
            Console.WriteLine($"Пользователь подключился: {user}");
        });

        hubConnection.On("UpdateChatList", () =>
        {
            Console.WriteLine("Список чатов обновлен");
        });

        try
        {
            // Подключение к хабу
            await hubConnection.StartAsync();
            Console.WriteLine("Подключение к ChatHub успешно");

            // Тестирование методов хаба
            var chatId = "ae5d35a0-871a-4bff-bcb9-95c54a68c8e2"; // Замените на реальный chatId
            var senderId = "6aff16a2-43b6-4351-b819-a98e3a472dc4"; // Замените на реальный senderId
            string message = "Тестовое сообщение";

            // Подключение к чату
            await hubConnection.InvokeAsync("JoinChat", chatId);
            Console.WriteLine($"Подключен к чату {chatId}");

            // Отправка сообщения
            await hubConnection.InvokeAsync("SendMessage", chatId, senderId, message);
            Console.WriteLine($"Отправлено сообщение: {message}");

            // Ожидание ввода для выхода
            Console.WriteLine("Нажмите любую клавишу для выхода...");
            Console.ReadKey();

            // Отключение от чата
            await hubConnection.InvokeAsync("LeaveChat", chatId);
            await hubConnection.StopAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка: {ex.Message}");
        }
    }
}