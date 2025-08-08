using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmoBack.Migrations
{
    /// <inheritdoc />
    public partial class ReactionContextFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Reactions",
                table: "Reactions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reactions",
                table: "Reactions",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Reactions_MessageId_UserId",
                table: "Reactions",
                columns: new[] { "MessageId", "UserId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Reactions",
                table: "Reactions");

            migrationBuilder.DropIndex(
                name: "IX_Reactions_MessageId_UserId",
                table: "Reactions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reactions",
                table: "Reactions",
                columns: new[] { "MessageId", "UserId" });
        }
    }
}
