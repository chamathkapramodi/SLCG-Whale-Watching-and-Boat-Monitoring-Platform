import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/icon";
import { useOperations } from "../../operations/useOperations";

interface TripSummary {
  id: string;
  boatName: string;
  registrationNumber: string;
  date: string;
  time: string;
  status: string;
}

const trips: TripSummary[] = [
  {
    id: "1",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    date: "16 July 2026",
    time: "06:30 AM",
    status: "Approved",
  },
  {
    id: "2",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    date: "17 July 2026",
    time: "06:30 AM",
    status: "Approved",
  },
  {
    id: "3",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    date: "18 July 2026",
    time: "06:30 AM",
    status: "Approved",
  },
];

const BoatCrewTrips = () => {
  const navigate = useNavigate();
  const { trips: sharedTrips } = useOperations();
  const visibleTrips: TripSummary[] = sharedTrips.length ? sharedTrips.map(trip => {
    const departure = new Date(trip.scheduledDepartureUtc);
    return { id: trip.id, boatName: trip.vesselName, registrationNumber: trip.registrationNumber,
      date: departure.toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" }),
      time: departure.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }),
      status: trip.shoreApproval };
  }) : trips;

  return (
    <div className="min-h-screen bg-[#1E1E1E] font-[Poppins] sm:px-4 sm:py-5 lg:px-8">
      <main className="relative mx-auto min-h-screen w-full bg-white px-5 pb-10 pt-4 shadow-2xl sm:min-h-[calc(100vh-40px)] sm:max-w-5xl sm:rounded-xl sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/crew")}
            aria-label="Back to dashboard"
            className="flex h-11 items-center rounded-full px-4 text-sm font-medium text-[#14223D] transition-colors hover:bg-slate-100"
          >
            <span aria-hidden="true" className="text-xl leading-none">←</span>
            <span className="ml-2">Back</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/crew/notifications")}
            aria-label="Open notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
          >
            <Icon name="notification" size={22} />
          </button>
        </header>

        <section className="mt-8">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Boat Crew</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#14223D] sm:text-3xl">My Trips</h1>
          <p className="mt-2 text-sm text-slate-500">View and manage your scheduled boat trips.</p>
        </section>

        <section className="mt-8 grid gap-4">
          {visibleTrips.map((trip) => (
            <article key={trip.id} className="rounded-2xl border border-slate-200 bg-[#F8FAFF] p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{trip.boatName}</p>
                  <p className="mt-1 text-sm text-[#374151]">{trip.registrationNumber}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{trip.date}</span>
                  <span>{trip.time}</span>
                  <span className="rounded-full bg-[#E4F7E4] px-3 py-1 text-[11px] font-semibold text-[#1B7A1B]">{trip.status}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/crew/trip-info/${trip.id}`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#142B57] px-4 py-3 text-xs font-medium text-white transition-colors hover:bg-[#1D3B75]"
                >
                  View details
                  <Icon name="info" size={14} className="[&_*]:stroke-white" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default BoatCrewTrips;
