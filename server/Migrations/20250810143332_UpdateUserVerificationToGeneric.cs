using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserVerificationToGeneric : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserVerifications_Users_UserId",
                table: "UserVerifications");

            migrationBuilder.DropIndex(
                name: "IX_UserVerifications_UserId",
                table: "UserVerifications");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserVerifications",
                newName: "AccountId");

            migrationBuilder.AddColumn<string>(
                name: "AccountType",
                table: "UserVerifications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountType",
                table: "UserVerifications");

            migrationBuilder.RenameColumn(
                name: "AccountId",
                table: "UserVerifications",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserVerifications_UserId",
                table: "UserVerifications",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserVerifications_Users_UserId",
                table: "UserVerifications",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
