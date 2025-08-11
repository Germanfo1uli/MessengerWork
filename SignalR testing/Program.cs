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
                options.AccessTokenProvider = () => Task.FromResult("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MTA0N2MxNy0wNzQ1LTRkZjEtYmM0ZC05NjIzY2ViOTIyY2QiLCJ1c2VybmFtZSI6Ik5lU3dhZ2EiLCJuYmYiOjE3NTMwODk5MzksImV4cCI6MTc1NTE2MzUzOSwiaWF0IjoxNzUzMDg5OTM5fQ.ldQvTaROSDbl4vTXjO2QI02vtA1aG20avWidFem4p1s"); // Замените на реальный токен
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
            var chatId = "0d7e9d08-6e5f-4d36-ab1c-df83c56dc565"; // Замените на реальный chatId
            var senderId = "41047c17-0745-4df1-bc4d-9623ceb922cd"; // Замените на реальный senderId
            int tempId = 12345678;
            string message = "Герман долбаеб";

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