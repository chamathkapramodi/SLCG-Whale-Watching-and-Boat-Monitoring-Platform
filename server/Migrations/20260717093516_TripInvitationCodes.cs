using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WhaleWatching.Api.Migrations
{
    /// <inheritdoc />
    public partial class TripInvitationCodes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InvitationCode",
                table: "Trips",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.Sql("UPDATE [Trips] SET [InvitationCode] = LOWER(REPLACE(CONVERT(nvarchar(36), NEWID()), '-', '')) WHERE [InvitationCode] IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_InvitationCode",
                table: "Trips",
                column: "InvitationCode",
                unique: true,
                filter: "[InvitationCode] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Trips_InvitationCode",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "InvitationCode",
                table: "Trips");
        }
    }
}
