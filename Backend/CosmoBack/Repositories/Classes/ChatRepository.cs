using CosmoBack.CosmoDBContext;
using CosmoBack.Models;
using CosmoBack.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CosmoBack.Repositories.Classes
{
    public class ChatRepository(CosmoDbContext context) : Repository<Chat>(context), IChatRepository
    {
        private readonly CosmoDbContext _context = context;

        public async Task<IEnumerable<Chat>> GetChatsByUserIdAsync(Guid userId)
        {
            return await _context.Chats
                .AsNoTracking()
                .Where(c => c.FirstUserId == userId || c.SecondUserId == userId)
                .Include(c => c.FirstUser)
                .Include(c => c.SecondUser)
                .Include(c => c.Messages)
                .ToListAsync();
        }

        public async Task<Chat> GetChatByIdWithMessagesAsync(Guid id)
        {
            return await _context.Chats
                .AsNoTracking()
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> ChatExistsBetweenUsersAsync(Guid firstUserId, Guid secondUserId)
        {
            return await _context.Chats
                .AsNoTracking()
                .AnyAsync(c =>
                    (c.FirstUserId == firstUserId && c.SecondUserId == secondUserId) ||
                    (c.FirstUserId == secondUserId && c.SecondUserId == firstUserId));
        }

        public async Task<Chat> CreateChatAsync(Chat chat)
        {
            chat.PublicId = await GenerateUniquePublicIdAsync();
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

        public async Task<IEnumerable<object>> GetChatsWithDetailsAsync(Guid userId)
        {
            return await _context.Chats
                .AsNoTracking()
                .Where(c => c.FirstUserId == userId || c.SecondUserId == userId)
                .Select(c => new
                {
                    Chat = c,
                    LastMessageData = c.Messages
                        .Join(_context.Users,
                            m => m.SenderId,
                            u => u.Id,
                            (m, u) => new
                            {
                                Message = m,
                                Username = u.Username,
                                AvatarImageId = u.AvatarImageId
                            })
                        .OrderByDescending(m => m.Message.CreatedAt)
                        .FirstOrDefault(),
                    SecondUser = _context.Users
                        .Where(u => u.Id == (c.FirstUserId == userId ? c.SecondUserId : c.FirstUserId))
                        .Select(u => new
                        {
                            Username = u.Username,
                            OnlineStatus = u.OnlineStatus,
                            ContactTag = _context.Contacts
                                .Where(con => con.OwnerId == userId && con.ContactId == u.Id)
                                .Select(con => con.ContactTag)
                                .FirstOrDefault()
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();
        }

        private async Task<long> GenerateUniquePublicIdAsync()
        {
            var random = new Random();
            long newId;
            do
            {
                newId = random.NextInt64(1, long.MaxValue); 
            } while (await _context.Chats.AnyAsync(c => c.PublicId == newId));
            return newId;
        }
    }
}