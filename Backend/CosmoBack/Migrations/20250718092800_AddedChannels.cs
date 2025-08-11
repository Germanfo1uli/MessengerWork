using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmoBack.Migrations
{
    /// <inheritdoc />
    public partial class AddedChannels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Channels_ChannelId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Channels_ChannelId",
                table: "Notifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChannelMembers",
                table: "ChannelMembers");

            migrationBuilder.AddColumn<long>(
                name: "PublicId",
                table: "Channels",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<bool>(
                name: "Notifications",
                table: "ChannelMembers",
                type: "boolean",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "ChannelMembers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "ChannelMembers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChannelMembers",
                table: "ChannelMembers",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_PublicId",
                table: "Channels",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMembers_ChannelId",
                table: "ChannelMembers",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMembers_Role",
                table: "ChannelMembers",
                column: "Role");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Channels_ChannelId",
                table: "Messages",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_ChannelMembers_ChannelId",
                table: "Notifications",
                column: "ChannelId",
                principalTable: "ChannelMembers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Channels_ChannelId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_ChannelMembers_ChannelId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Channels_PublicId",
                table: "Channels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChannelMembers",
                table: "ChannelMembers");

            migrationBuilder.DropIndex(
                name: "IX_ChannelMembers_ChannelId",
                table: "ChannelMembers");

            migrationBuilder.DropIndex(
                name: "IX_ChannelMembers_Role",
                table: "ChannelMembers");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "ChannelMembers");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "ChannelMembers");

            migrationBuilder.AlterColumn<bool>(
                name: "Notifications",
                table: "ChannelMembers",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChannelMembers",
                table: "ChannelMembers",
                columns: new[] { "ChannelId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Channels_ChannelId",
                table: "Messages",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Channels_ChannelId",
                table: "Notifications",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
