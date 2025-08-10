using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEmailOtpGeneric : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailOtps_Users_UserId",
                table: "EmailOtps");

            migrationBuilder.DropIndex(
                name: "IX_EmailOtps_UserId",
                table: "EmailOtps");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "EmailOtps",
                newName: "AccountId");

            migrationBuilder.AddColumn<string>(
                name: "UserType",
                table: "EmailOtps",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserType",
                table: "EmailOtps");

            migrationBuilder.RenameColumn(
                name: "AccountId",
                table: "EmailOtps",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailOtps_UserId",
                table: "EmailOtps",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailOtps_Users_UserId",
                table: "EmailOtps",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
