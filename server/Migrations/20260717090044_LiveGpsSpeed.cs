using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WhaleWatching.Api.Migrations
{
    /// <inheritdoc />
    public partial class LiveGpsSpeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CruisingSpeedKnots",
                table: "Boats");

            migrationBuilder.AddColumn<decimal>(
                name: "SpeedKnots",
                table: "GpsTelemetry",
                type: "decimal(6,2)",
                precision: 6,
                scale: 2,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpeedKnots",
                table: "GpsTelemetry");

            migrationBuilder.AddColumn<decimal>(
                name: "CruisingSpeedKnots",
                table: "Boats",
                type: "decimal(6,2)",
                precision: 6,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }
    }
}
