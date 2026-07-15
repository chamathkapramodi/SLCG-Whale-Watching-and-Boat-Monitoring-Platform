export type ShoreApproval = "Approved" | "Declined" | "Pending";

export interface ShoreTrip {
  id: string;
  vesselName: string;
  owner: string;
  registrationNumber: string;
  scheduledDateTime: string;
  approval: ShoreApproval;
}

export const shoreTrips: ShoreTrip[] = [
  { id: "ST-2047", vesselName: "FV Mirissa King", owner: "Nimal Perera", registrationNumber: "SL-WB-2047", scheduledDateTime: "2026-07-16T06:30:00", approval: "Pending" },
  { id: "ST-2048", vesselName: "Blue Horizon", owner: "Kasun Silva", registrationNumber: "SL-WB-2048", scheduledDateTime: "2026-07-16T08:30:00", approval: "Approved" },
  { id: "ST-2049", vesselName: "Sea Pearl", owner: "Amal Fernando", registrationNumber: "SL-WB-2049", scheduledDateTime: "2026-07-16T09:30:00", approval: "Declined" },
  { id: "ST-2050", vesselName: "Marine Star", owner: "Dilan Kumara", registrationNumber: "SL-WB-2050", scheduledDateTime: "2026-07-17T06:00:00", approval: "Pending" },
  { id: "ST-2051", vesselName: "Ocean Explorer", owner: "Ruwan Jayasinghe", registrationNumber: "SL-WB-2051", scheduledDateTime: "2026-07-17T07:30:00", approval: "Approved" },
];

export function formatTripDate(value: string) {
  return new Intl.DateTimeFormat("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
