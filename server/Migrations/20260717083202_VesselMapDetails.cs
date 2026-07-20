using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WhaleWatching.Api.Migrations
{
    /// <inheritdoc />
    public partial class VesselMapDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChildrenCount",
                table: "Trips",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SpecialNeedsCount",
                table: "Trips",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "CruisingSpeedKnots",
                table: "Boats",
                type: "decimal(6,2)",
                precision: 6,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "GpsDeviceId",
                table: "Boats",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LifeJacketCount",
                table: "Boats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "MaximumSpeedKnots",
                table: "Boats",
                type: "decimal(6,2)",
                precision: 6,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "WildlifeApproval",
                table: "Boats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Boats_GpsDeviceId",
                table: "Boats",
                column: "GpsDeviceId",
                unique: true,
                filter: "[GpsDeviceId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Boats_GpsDeviceId",
                table: "Boats");

            migrationBuilder.DropColumn(
                name: "ChildrenCount",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "SpecialNeedsCount",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "CruisingSpeedKnots",
                table: "Boats");

            migrationBuilder.DropColumn(
                name: "GpsDeviceId",
                table: "Boats");

            migrationBuilder.DropColumn(
                name: "LifeJacketCount",
                table: "Boats");

            migrationBuilder.DropColumn(
                name: "MaximumSpeedKnots",
                table: "Boats");

            migrationBuilder.DropColumn(
                name: "WildlifeApproval",
                table: "Boats");
        }
    }
}
