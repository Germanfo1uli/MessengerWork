using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmoBack.Migrations
{
    /// <inheritdoc />
    public partial class ContextFix1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_ChannelMembers_ChannelId",
                table: "Notifications");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Channels_ChannelId",
                table: "Notifications",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Channels_ChannelId",
                table: "Notifications");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_ChannelMembers_ChannelId",
                table: "Notifications",
                column: "ChannelId",
                principalTable: "ChannelMembers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
