using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WhaleWatching.Api.Migrations
{
    /// <inheritdoc />
    public partial class PassengerTripRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PassengerProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    IdentificationNumber = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    NormalizedIdentificationNumber = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    NormalizedPhoneNumber = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    PassengerType = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    AgeCategory = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PassengerProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TripPassengers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PassengerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RegisteredAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripPassengers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripPassengers_PassengerProfiles_PassengerId",
                        column: x => x.PassengerId,
                        principalTable: "PassengerProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TripPassengers_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PassengerProfiles_NormalizedIdentificationNumber",
                table: "PassengerProfiles",
                column: "NormalizedIdentificationNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TripPassengers_PassengerId",
                table: "TripPassengers",
                column: "PassengerId");

            migrationBuilder.CreateIndex(
                name: "IX_TripPassengers_TripId_PassengerId",
                table: "TripPassengers",
                columns: new[] { "TripId", "PassengerId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TripPassengers");

            migrationBuilder.DropTable(
                name: "PassengerProfiles");
        }
    }
}
