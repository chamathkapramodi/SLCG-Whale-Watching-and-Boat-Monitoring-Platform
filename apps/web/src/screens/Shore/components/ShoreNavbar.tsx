import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import { Icon } from "../../../components/ui/icon";

const ShoreNavbar = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const onTripsPage = location.pathname.startsWith("/shore/trips");

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/shore" aria-label="Shore Officer dashboard">
          <img src="/SLCG.png" alt="Sri Lanka Coast Guard" className="h-9 w-auto sm:h-10" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm lg:flex" aria-label="Shore Officer navigation">
          <button type="button" aria-label="Notifications" className="text-slate-500 transition hover:text-[#14223d]">
            <Icon name="notification" size={20} />
          </button>
          <Link to={onTripsPage ? "/shore" : "/shore/trips"} className="font-medium text-slate-500 transition hover:text-[#14223d]">
            {onTripsPage ? "Home" : "Trips"}
          </Link>
          <Link to="/shore" className="font-medium text-slate-500 transition hover:text-[#14223d]">Settings</Link>
          <button type="button" onClick={signOut} className="rounded-md bg-[#14223d] px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-[#22375f]">Log Out</button>
        </nav>

        <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md hover:bg-slate-100 lg:hidden" aria-label="Toggle navigation" aria-expanded={open}>
          <span className={`h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <Link onClick={() => setOpen(false)} to={onTripsPage ? "/shore" : "/shore/trips"} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-slate-50">{onTripsPage ? "Home" : "Trips"}</Link>
          <Link onClick={() => setOpen(false)} to="/shore" className="rounded-md px-3 py-3 text-sm font-medium hover:bg-slate-50">Settings</Link>
          <button type="button" onClick={signOut} className="mt-2 rounded-md bg-[#14223d] px-4 py-3 text-left text-sm font-semibold text-white">Log Out</button>
        </nav>
      )}
    </header>
  );
};

export default ShoreNavbar;
