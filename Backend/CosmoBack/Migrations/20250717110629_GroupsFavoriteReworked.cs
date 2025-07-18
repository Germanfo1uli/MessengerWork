using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmoBack.Migrations
{
    /// <inheritdoc />
    public partial class GroupsFavoriteReworked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Favorite",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "Favorite",
                table: "Chats");

            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "GroupMembers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "ChatMembers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "GroupMembers");

            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "ChatMembers");

            migrationBuilder.AddColumn<bool>(
                name: "Favorite",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Favorite",
                table: "Chats",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
