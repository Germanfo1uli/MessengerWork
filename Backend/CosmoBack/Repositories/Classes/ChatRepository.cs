using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CosmoBack.Repositories.Classes
{
    public class ChatRepository(CosmoDbContext context) : Repository<Chat>(context), IChatRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<IEnumerable<Chat>> GetChatsByUserIdAsync(Guid userId)
        {
            return await _context.Chats
                .Where(c => c.FirstUserId == userId || c.SecondUserId == userId)
                .Include(c => c.FirstUser)
                .Include(c => c.SecondUser)
                .Include(c => c.Messages)
                .ToListAsync();
        }

        public async Task<Chat> GetChatByIdWithMessagesAsync(Guid id)
        {
            return await _context.Chats
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> ChatExistsBetweenUsersAsync(Guid firstUserId, Guid secondUserId)
        {
            return await _context.Chats
                .AnyAsync(c =>
                    (c.FirstUserId == firstUserId && c.SecondUserId == secondUserId) ||
                    (c.FirstUserId == secondUserId && c.SecondUserId == firstUserId));
        }

        public async Task<Chat> CreateChatAsync(Chat chat)
        {
            await _context.Chats.AddAsync(chat);
            await _context.SaveChangesAsync();
            return chat;
        }

        public async Task DeleteChatAsync(Guid chatId)
        {
            var chat = await _context.Chats.FindAsync(chatId);
            if (chat != null)
            {
                _context.Chats.Remove(chat);
                await _context.SaveChangesAsync();
            }
        }
    }
}