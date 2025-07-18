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
                options.AccessTokenProvider = () => Task.FromResult("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YWZmMTZhMi00M2I2LTQzNTEtYjgxOS1hOThlM2E0NzJkYzQiLCJ1c2VybmFtZSI6Ik5pa2l0YSIsIm5iZiI6MTc1Mjc0NTM5NCwiZXhwIjoxNzU0ODE4OTk0LCJpYXQiOjE3NTI3NDUzOTR9.xVwpfqStrSD4P2slmA0kStciQ0WgX9mS8tPZBjFmvOI"); // Замените на реальный токен
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
            var chatId = "4fb5dc96-39e5-45bd-adf9-4b8f467e8391"; // Замените на реальный chatId
            var senderId = "6aff16a2-43b6-4351-b819-a98e3a472dc4"; // Замените на реальный senderId
            int tempId = 12345678;
            string message = "Я ГЕЙ ПОМОГИТЕ";

            // Подключение к чату
            await hubConnection.InvokeAsync("JoinChat", chatId);
            Console.WriteLine($"Подключен к чату {chatId}");

            // Отправка сообщения
            await hubConnection.InvokeAsync("SendMessage", chatId, senderId, message, tempId);
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