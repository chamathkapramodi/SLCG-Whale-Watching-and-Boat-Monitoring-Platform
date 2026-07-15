import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatTripDate, shoreTrips, type ShoreApproval } from "./shoreData";

const passengers = ["Rathnayake M.", "Fernando A.", "Perera S.", "Silva N."];
const crew = [{ name: "Rathnayake M.", role: "Crewman" }, { name: "Jayasinghe K.", role: "Driver" }, { name: "Fernando T.", role: "Driver" }];

const ShoreTripInfo = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = shoreTrips.find((item) => item.id === tripId) ?? shoreTrips[0];
  const [approval, setApproval] = useState<ShoreApproval>(trip.approval);
  const [result, setResult] = useState<"approved" | "declined" | null>(null);

  const decide = (decision: "approved" | "declined") => {
    setApproval(decision === "approved" ? "Approved" : "Declined");
    setResult(decision);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="overflow-hidden rounded-xl bg-white shadow-sm">
          <img src="/gallery-2.jpg" alt="Whale watching vessel at sea" className="h-52 w-full object-cover" />
          <div className="p-6"><h1 className="text-2xl font-semibold text-[#14223d]">{trip.vesselName}</h1><p className="mt-1 text-xs text-slate-400">{trip.registrationNumber}</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-xs"><Detail label="Owner" value={trip.owner} /><Detail label="Departure" value={formatTripDate(trip.scheduledDateTime)} /><Detail label="Length" value="12.6 M" /><Detail label="Capacity" value="26 Passengers" /><Detail label="Crew" value="03 Members" /><Detail label="Status" value={approval} /></dl>
          </div>
        </aside>

        <div className="grid gap-5">
          <DataCard title="Passengers" columns={["Name", "NIC or Passport", "Age", "Nationality"]} rows={passengers.map((name, index) => [name, `20032${index}7833`, "Adult", "Local"])} />
          <div className="grid gap-5 lg:grid-cols-[1fr_250px]">
            <DataCard title="Crew" columns={["Name", "NIC", "Role", "Certified"]} rows={crew.map((member, index) => [member.name, `20032${index}7833`, member.role, "Yes"])} />
            <section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-[#14223d]">Approval</h2><p className="mt-3 text-xs leading-5 text-slate-500">Inspection completed. The information entered in the system has been verified against the actual vessel and all safety requirements, including passenger capacity and life jacket availability.</p>
              <div className="mt-6 grid gap-3"><button type="button" onClick={() => decide("approved")} className="rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Approve</button><button type="button" onClick={() => decide("declined")} className="rounded-md bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">Decline</button></div>
            </section>
          </div>
        </div>
      </div>
      {result && <DecisionDialog decision={result} onClose={() => setResult(null)} />}
    </main>
  );
};

function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-slate-400">{label}</dt><dd className="mt-1 font-medium text-[#14223d]">{value}</dd></div>; }

function DataCard({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) { return <section className="overflow-hidden rounded-xl bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><h2 className="text-lg font-semibold text-[#14223d]">{title}</h2><input aria-label={`Search ${title}`} placeholder="Search" className="w-28 rounded-md border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-400 sm:w-40" /></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr>{columns.map((column) => <th key={column} className="px-6 py-3 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index}>{row.map((value, cell) => <td key={cell} className="px-6 py-4 text-slate-600">{value}</td>)}</tr>)}</tbody></table></div></section>; }

function DecisionDialog({ decision, onClose }: { decision: "approved" | "declined"; onClose: () => void }) { const approved = decision === "approved"; return <div role="presentation" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4" onMouseDown={onClose}><section role="dialog" aria-modal="true" aria-labelledby="decision-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-2xl"><div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold text-white ${approved ? "bg-emerald-400" : "bg-red-500"}`}>{approved ? "✓" : "!"}</div><p className={`mt-4 text-xs font-bold uppercase ${approved ? "text-emerald-500" : "text-red-500"}`}>{approved ? "Approved" : "Declined"}</p><h2 id="decision-title" className="mt-5 text-lg font-semibold text-[#14223d]">Ride {approved ? "Successfully Authorized" : "Not Authorized"}</h2><p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-slate-500">{approved ? "Authorization has been completed successfully. All required checks have been verified." : "The authorization request has been declined. The applicant must resolve the identified issues before submitting a new request."}</p><button type="button" onClick={onClose} className={`mt-7 w-full rounded-md px-4 py-3 text-sm font-semibold text-white ${approved ? "bg-emerald-400 hover:bg-emerald-500" : "bg-red-500 hover:bg-red-600"}`}>Continue</button></section></div>; }

export default ShoreTripInfo;
