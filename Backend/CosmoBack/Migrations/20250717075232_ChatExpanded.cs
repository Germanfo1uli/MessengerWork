using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmoBack.Migrations
{
    /// <inheritdoc />
    public partial class ChatExpanded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Favorite",
                table: "Chats",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PublicId",
                table: "Chats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Chats_PublicId",
                table: "Chats",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Chats_PublicId",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "Favorite",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Chats");
        }
    }
}
