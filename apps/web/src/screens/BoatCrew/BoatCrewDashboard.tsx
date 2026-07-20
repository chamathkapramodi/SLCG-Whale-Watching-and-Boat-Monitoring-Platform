import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/icon";
import { useOperations } from "../../operations/useOperations";

type TripStatus = "Approved" | "Pending" | "Cancelled";

interface Trip {
  id: string;
  boatName: string;
  registrationNumber: string;
  time: string;
  date: string;
  status: TripStatus;
  image: string;
}

interface MenuItem {
  label: string;
  icon: "user" | "info" | "confirm";
  path: string;
}

const ongoingTrip: Trip = {
  id: "1",
  boatName: "Mirissa King",
  registrationNumber: "SL-WB-2047",
  time: "06:30 AM",
  date: "16 July 2026",
  status: "Approved",
  image: "",
};

const upcomingTrips: Trip[] = [
  {
    id: "2",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    time: "06:30 AM",
    date: "17 July 2026",
    status: "Approved",
    image: "image3.png",
  },
  {
    id: "3",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    time: "06:30 AM",
    date: "18 July 2026",
    status: "Approved",
    image: "image3.png",
  },
];

const menuItems: MenuItem[] = [
  {
    label: "Profile",
    icon: "user",
    path: "/crew/profile",
  },
  {
    label: "My Trips",
    icon: "info",
    path: "/crew/trips",
  },
  {
    label: "Settings",
    icon: "confirm",
    path: "/crew/settings",
  },
];

const BoatCrewDashboard = () => {
  const navigate = useNavigate();
  const { trips: sharedTrips } = useOperations();
  const mappedTrips = useMemo<Trip[]>(() => sharedTrips.map(trip => {
    const departure = new Date(trip.scheduledDepartureUtc);
    return { id: trip.id, boatName: trip.vesselName, registrationNumber: trip.registrationNumber,
      time: departure.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }),
      date: departure.toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" }),
      status: trip.status === "Cancelled" ? "Cancelled" : trip.shoreApproval === "Pending" ? "Pending" : "Approved",
      image: "" };
  }), [sharedTrips]);
  const currentTrip = mappedTrips.find(trip => sharedTrips.find(item => item.id === trip.id)?.status === "Ongoing") ?? mappedTrips[0] ?? ongoingTrip;
  const scheduledTrips = mappedTrips.filter(trip => trip.id !== currentTrip.id).slice(0, 3);
  const visibleUpcomingTrips = scheduledTrips.length ? scheduledTrips : upcomingTrips;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleTripNavigation = (tripId: string): void => {
    navigate(`/crew/trip-info/${tripId}`);
  };

  const handleNotificationNavigation = (): void => {
    navigate("/crew/notifications");
  };

  const handleMenuNavigation = (path: string): void => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const getStatusTextClass = (status: TripStatus): string => {
    switch (status) {
      case "Approved":
        return "text-[#20C928]";

      case "Pending":
        return "text-amber-500";

      case "Cancelled":
        return "text-red-500";

      default:
        return "text-slate-500";
    }
  };

  const getStatusDotClass = (status: TripStatus): string => {
    switch (status) {
      case "Approved":
        return "bg-[#20C928]";

      case "Pending":
        return "bg-amber-500";

      case "Cancelled":
        return "bg-red-500";

      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-3 font-[Poppins] sm:p-5 lg:p-7">
      <main
        className="
          relative
          mx-auto
          min-h-[calc(100vh-24px)]
          w-full
          max-w-7xl
          overflow-hidden
          rounded-xl
          bg-white
          px-4
          pb-7
          pt-4
          shadow-2xl
          sm:min-h-[calc(100vh-40px)]
          sm:px-6
          sm:pb-8
          sm:pt-5
          lg:min-h-[calc(100vh-56px)]
          lg:px-9
          lg:pb-10
          lg:pt-7
        "
      >
        {/* Top navigation */}
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleNotificationNavigation}
            aria-label="Open notifications"
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              text-[#111827]
              transition-colors
              duration-200
              hover:bg-[#F2F5FA]
            "
          >
            <Icon name="notification" size={22} />

            <span
              className="
                absolute
                right-[7px]
                top-[7px]
                h-2
                w-2
                rounded-full
                border
                border-white
                bg-red-500
              "
            />
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="
              flex
              h-11
              w-11
              flex-col
              items-center
              justify-center
              gap-[5px]
              rounded-lg
              transition-colors
              duration-200
              hover:bg-[#F2F5FA]
            "
          >
            <span className="h-[3px] w-7 rounded-full bg-black" />
            <span className="h-[3px] w-7 rounded-full bg-black" />
            <span className="h-[3px] w-7 rounded-full bg-black" />
          </button>
        </header>

        {/* Desktop aligned layout */}
        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.5fr)]
            lg:gap-x-8
            lg:gap-y-5
          "
        >
          {/* Profile information */}
          <section
            className="
              flex
              min-h-[105px]
              items-center
              rounded-2xl
              bg-white
              px-1
              py-2
              sm:min-h-[120px]
              sm:px-3
              lg:min-h-[130px]
              lg:px-4
            "
          >
            <img
              src="man.jpg"
              alt="Nimal Silva"
              onError={(event) => {
                event.currentTarget.src = "/SLCG.png";
              }}
              className="
                h-14
                w-14
                shrink-0
                rounded-full
                object-cover
                sm:h-16
                sm:w-16
                lg:h-20
                lg:w-20
              "
            />

            <div className="ml-3 sm:ml-4">
              <p className="text-[9px] text-slate-400 sm:text-[10px]">
                Welcome Back
              </p>

              <h1
                className="
                  mt-0.5
                  text-lg
                  font-semibold
                  leading-tight
                  text-[#111827]
                  sm:text-xl
                  lg:text-2xl
                "
              >
                Nimal Silva
              </h1>

              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#20C928]" />

                <span className="text-[8px] font-medium uppercase text-[#20C928] sm:text-[9px]">
                  Approved
                </span>
              </div>
            </div>
          </section>

          {/* Upcoming trips heading aligned with profile */}
          <section
            className="
              flex
              min-h-[70px]
              items-center
              justify-between
              sm:min-h-[90px]
              lg:min-h-[130px]
            "
          >
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:text-[10px]">
                Schedule
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#111827] sm:text-2xl">
                Upcoming Trips
              </h2>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#EDF3FF]
              "
            >
              <Icon
                name="vessel"
                size={23}
                className="[&_*]:stroke-[#075AEE]"
              />
            </div>
          </section>

          {/* Ongoing trip card without image */}
          <article
            className="
              relative
              min-h-[245px]
              overflow-hidden
              rounded-3xl
              bg-gradient-to-br
              from-[#17336B]
              to-[#075AEE]
              text-white
              shadow-[0_14px_30px_rgba(20,45,99,0.30)]
              transition-all
              duration-300
              hover:-translate-y-1
              sm:min-h-[300px]
              lg:min-h-[430px]
            "
          >
            <button
              type="button"
              onClick={() => handleTripNavigation(currentTrip.id)}
              aria-label={`Open trip information for ${currentTrip.boatName}`}
              className="
                flex
                min-h-[245px]
                w-full
                flex-col
                justify-between
                p-5
                text-left
                sm:min-h-[300px]
                sm:p-7
                lg:min-h-[430px]
                lg:p-8
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80 sm:text-base">
                    Ongoing Trip
                  </p>

                  <h2 className="mt-5 text-xl font-semibold sm:text-2xl">
                    {currentTrip.boatName}
                  </h2>

                  <p className="mt-1 text-[10px] text-white/75 sm:text-xs">
                    {currentTrip.registrationNumber}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                  "
                >
                  <Icon
                    name="vessel"
                    size={24}
                    className="[&_*]:stroke-white"
                  />
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-white/70 sm:text-xs">
                      Departure Time
                    </p>

                    <p className="mt-1 text-sm font-medium sm:text-lg">
                      {currentTrip.time}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-white/70 sm:text-xs">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-medium sm:text-lg">
                      {currentTrip.date}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-white/20 pt-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusDotClass(
                        currentTrip.status,
                      )}`}
                    />

                    <span className="text-[9px] font-medium uppercase text-[#64FF6B]">
                      {currentTrip.status}
                    </span>
                  </div>

                  <span className="text-xs text-white/75">
                    View trip details
                  </span>
                </div>
              </div>
            </button>

            {/* Separate information icon */}
            <button
              type="button"
              onClick={() => handleTripNavigation(currentTrip.id)}
              aria-label="Open ongoing trip information"
              title="Trip information"
              className="
                absolute
                bottom-[77px]
                right-5
                z-10
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/15
                backdrop-blur-sm
                transition-colors
                duration-200
                hover:bg-white/30
                sm:right-7
              "
            >
              <Icon
                name="info"
                size={21}
                className="[&_*]:stroke-white [&_*]:stroke-[2.5]"
              />
            </button>
          </article>

          {/* Upcoming trip cards */}
          <section>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {visibleUpcomingTrips.map((trip) => (
                <article
                  key={trip.id}
                  className="
                    flex
                    min-h-[300px]
                    flex-col
                    rounded-2xl
                    bg-white
                    p-3
                    shadow-[0_8px_24px_rgba(15,23,42,0.15)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_14px_32px_rgba(15,23,42,0.20)]
                    sm:p-4
                    lg:min-h-[430px]
                  "
                >
                  <button
                    type="button"
                    onClick={() => handleTripNavigation(trip.id)}
                    aria-label={`Open trip information for ${trip.boatName}`}
                    className="
                      grid
                      w-full
                      flex-1
                      grid-cols-[minmax(100px,0.8fr)_minmax(145px,1.2fr)]
                      gap-3
                      text-left
                      sm:grid-cols-[minmax(120px,0.8fr)_minmax(180px,1.2fr)]
                      lg:grid-cols-1
                    "
                  >
                    <div className="flex flex-col justify-center py-2">
                      <p className="text-xs font-semibold text-[#111827] sm:text-sm">
                        Boat
                      </p>

                      <p className="mt-1 text-xs text-[#374151] sm:text-sm">
                        {trip.boatName}
                      </p>

                      <p className="mt-3 text-xs font-semibold text-[#111827] sm:text-sm">
                        Time
                      </p>

                      <p className="mt-1 text-xs text-[#374151] sm:text-sm">
                        {trip.time}
                      </p>

                      <p className="mt-1 text-[9px] text-slate-400 sm:text-[10px]">
                        {trip.date}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${getStatusDotClass(
                            trip.status,
                          )}`}
                        />

                        <span
                          className={`text-[8px] font-medium uppercase sm:text-[9px] ${getStatusTextClass(
                            trip.status,
                          )}`}
                        >
                          {trip.status}
                        </span>
                      </div>
                    </div>

                    <img
                      src={trip.image}
                      alt={trip.boatName}
                      onError={(event) => {
                        event.currentTarget.src = "/SLCG.png";
                      }}
                      className="
                        h-40
                        w-full
                        rounded-xl
                        object-cover
                        sm:h-44
                        lg:h-52
                        xl:h-48
                      "
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTripNavigation(trip.id)}
                    className="
                      mt-3
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#142B57]
                      text-xs
                      font-medium
                      text-white
                      transition-colors
                      duration-200
                      hover:bg-[#203D73]
                    "
                  >
                    Info

                    <Icon
                      name="info"
                      size={15}
                      className="[&_*]:stroke-white"
                    />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Menu drawer */}
        {isMenuOpen && (
          <>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 cursor-default bg-black/45"
            />

            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Boat crew menu"
              className="
                fixed
                right-0
                top-0
                z-50
                h-screen
                w-[280px]
                border-l-2
                border-[#8B3DFF]
                bg-white
                px-7
                py-7
                shadow-2xl
                sm:w-[320px]
              "
            >
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-2xl
                  font-light
                  text-black
                  transition-colors
                  hover:bg-slate-100
                "
              >
                ×
              </button>

              <nav className="mt-14">
                <ul className="space-y-3">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => handleMenuNavigation(item.path)}
                        className="
                          group
                          flex
                          w-full
                          items-center
                          gap-5
                          rounded-lg
                          px-3
                          py-4
                          text-left
                          text-sm
                          font-medium
                          text-black
                          transition-colors
                          duration-200
                          hover:bg-[#F3F6FC]
                        "
                      >
                        <Icon
                          name={item.icon}
                          size={24}
                          className="
                            [&_*]:stroke-black
                            group-hover:[&_*]:stroke-[#075AEE]
                          "
                        />

                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </>
        )}
      </main>
    </div>
  );
};

export default BoatCrewDashboard;
