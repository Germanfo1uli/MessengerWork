using Microsoft.EntityFrameworkCore;
using CosmoBack.Models;

namespace CosmoBack.CosmoDBContext
{
    public class CosmoDbContext : DbContext
    {
        public CosmoDbContext(DbContextOptions<CosmoDbContext> options) : base(options) { }

        // Пользователи и аутентификация
        public DbSet<User> Users { get; set; }
        public DbSet<OAuthProvider> OAuthProviders { get; set; }
        public DbSet<UserOAuth> UserOAuths { get; set; }
        public DbSet<Token> Tokens { get; set; }

        // Социальные сущности
        public DbSet<Channel> Channels { get; set; }
        public DbSet<ChannelMember> ChannelMembers { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatMember> ChatMembers { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        // Контент
        public DbSet<Message> Messages { get; set; }
        public DbSet<Media> Media { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<Reaction> Reactions { get; set; }

        // Платежи и подписки
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }

        // Уведомления
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureAuthAndUsers(modelBuilder);
            ConfigureSocialStructure(modelBuilder);
            ConfigureContent(modelBuilder);
            ConfigurePayments(modelBuilder);
            ConfigureNotifications(modelBuilder);
        }

        private void ConfigureAuthAndUsers(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Token>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserOAuth>()
                .HasOne(uo => uo.User)
                .WithMany(u => u.OAuths)
                .HasForeignKey(uo => uo.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserOAuth>()
                .HasOne(uo => uo.OAuthProvider)
                .WithMany(op => op.Users)
                .HasForeignKey(uo => uo.ProviderId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        private void ConfigureSocialStructure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChannelMember>()
                .HasKey(cm => new { cm.ChannelId, cm.UserId });

            modelBuilder.Entity<ChannelMember>()
                .HasOne(cm => cm.Channel)
                .WithMany(c => c.Members)
                .HasForeignKey(cm => cm.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GroupMember>()
                .HasKey(gm => new { gm.GroupId, gm.UserId });

            modelBuilder.Entity<GroupMember>()
                .HasOne(gm => gm.Group)
                .WithMany(g => g.Members)
                .HasForeignKey(gm => gm.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatMember>()
                .HasKey(cm => new { cm.ChatId, cm.UserId });

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.FirstUser)
                .WithMany(u => u.ChatsAsFirstUser)
                .HasForeignKey(c => c.FirstUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.SecondUser)
                .WithMany(u => u.ChatsAsSecondUser)
                .HasForeignKey(c => c.SecondUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Chat>()
                .HasIndex(c => c.PublicId)
                .IsUnique();

            modelBuilder.Entity<Group>()
                .HasIndex(g => g.PublicId)
                .IsUnique();

            modelBuilder.Entity<Group>()
                .Property(g => g.Favorite)
                .HasDefaultValue(false);

            modelBuilder.Entity<Contact>()
                .HasOne(c => c.Owner)
                .WithMany(u => u.Contacts)
                .HasForeignKey(c => c.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Contact>()
                .HasOne(c => c.ContactUser)
                .WithMany(u => u.ContactOf)
                .HasForeignKey(c => c.ContactId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        private void ConfigureContent(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Chat)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Group)
                .WithMany(g => g.Messages)
                .HasForeignKey(m => m.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.CreatedAt);

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.GroupId);

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.ChannelId);

            modelBuilder.Entity<Media>()
                .HasOne(m => m.Message)
                .WithMany(m => m.Media)
                .HasForeignKey(m => m.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Media>()
                .HasIndex(m => m.MessageId);

            modelBuilder.Entity<Reply>()
                .HasOne(r => r.OriginalMessage)
                .WithMany()
                .HasForeignKey(r => r.OriginalMessageId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reply>()
                .HasIndex(r => r.OriginalMessageId);

            modelBuilder.Entity<Reaction>()
                .HasKey(r => new { r.MessageId, r.UserId });

            modelBuilder.Entity<Reaction>()
                .HasIndex(r => r.MessageId);

            modelBuilder.Entity<Reaction>()
                .HasIndex(r => r.UserId);
        }

        private void ConfigurePayments(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureNotifications(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Group)
                .WithMany()
                .HasForeignKey(n => n.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Chat)
                .WithMany()
                .HasForeignKey(n => n.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Channel)
                .WithMany()
                .HasForeignKey(n => n.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasIndex(n => new { n.UserId, n.ChatId, n.GroupId, n.ChannelId });
        }
    }
}