using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmoBack.Migrations
{
    /// <inheritdoc />
    public partial class RepliesAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Replies_Messages_OriginalMessageId",
                table: "Replies");

            migrationBuilder.AddForeignKey(
                name: "FK_Replies_Messages_OriginalMessageId",
                table: "Replies",
                column: "OriginalMessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Replies_Messages_OriginalMessageId",
                table: "Replies");

            migrationBuilder.AddForeignKey(
                name: "FK_Replies_Messages_OriginalMessageId",
                table: "Replies",
                column: "OriginalMessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
