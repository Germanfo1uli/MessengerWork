using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmoBack.Migrations
{
    /// <inheritdoc />
    public partial class LogicRework : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId_ChatId_GroupId_ChannelId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "LastMessageId",
                table: "Chats");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId_ChatId_GroupId_ChannelId",
                table: "Notifications",
                columns: new[] { "UserId", "ChatId", "GroupId", "ChannelId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId_ChatId_GroupId_ChannelId",
                table: "Notifications");

            migrationBuilder.AddColumn<Guid>(
                name: "LastMessageId",
                table: "Chats",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId_ChatId_GroupId_ChannelId",
                table: "Notifications",
                columns: new[] { "UserId", "ChatId", "GroupId", "ChannelId" },
                unique: true);
        }
    }
}
