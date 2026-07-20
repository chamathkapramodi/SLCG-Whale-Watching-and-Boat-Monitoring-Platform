import {
  useEffect,
  useState,
} from "react";
import {
  Menu as MenuIcon,
  Settings,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import groupIcon from "../../assets/icons/group.svg";
import infoIcon from "../../assets/icons/info.svg";
import notificationIcon from "../../assets/icons/notification.svg";
import userIcon from "../../assets/icons/user.svg";
import vesselIcon from "../../assets/icons/vessel.svg";

interface Boat {
  id: string;
  name: string;
  registrationNumber: string;
  image: string;
}

interface Trip {
  id: string;
  boatName: string;
  registrationNumber: string;
}

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  type?: "settings";
}

const boats: Boat[] = [
  {
    id: "boat-001",
    name: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    image: "/OwnerBoat1.png",
  },
  {
    id: "boat-002",
    name: "Sea Princess",
    registrationNumber: "SL-WB-2038",
    image: "/OwnerBoat2.png",
  },
];

const ongoingTrips: Trip[] = [
  {
    id: "trip-001",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
  },
  {
    id: "trip-002",
    boatName: "Sea Princess",
    registrationNumber: "SL-WB-2048",
  },
];

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/owner",
    icon: infoIcon,
  },
  {
    label: "Profile",
    path: "/owner/profile",
    icon: userIcon,
  },
  {
    label: "My Crew",
    path: "/owner/crew",
    icon: groupIcon,
  },
  {
    label: "My Boats",
    path: "/owner/boats",
    icon: vesselIcon,
  },
  {
    label: "My Trips",
    path: "/owner/trips",
    icon: infoIcon,
  },
  {
    label: "Settings",
    path: "/owner/settings",
    type: "settings",
  },
];

function BoatOwnerDashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const openPage = (path: string): void => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
   <main className="boat-owner-page min-h-dvh w-full overflow-x-hidden bg-white text-black">
      {/* Hero section */}
      <header
        className="
          relative min-h-[220px] w-full overflow-hidden
          bg-white
          sm:min-h-[290px]
          lg:min-h-[380px]
          xl:min-h-[420px]
        "
      >
        <img
          src="/BG2.png"
          alt=""
          aria-hidden="true"
          className="
            absolute inset-0 h-full w-full object-cover
            object-[62%_center]
            sm:object-[60%_35%]
            lg:object-[70%_32%]
            xl:object-[72%_30%]
          "
        />

        {/* Bottom gradient */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-gradient-to-b
            from-white/5
            via-white/5
            to-white
          "
        />

        {/* Notification and menu buttons */}
        <div
          className="
            relative z-20 flex w-full
            items-center justify-between
            px-5 pt-5
            sm:px-8 sm:pt-7
            lg:px-12 lg:pt-8
            xl:px-16
          "
        >
          <button
            type="button"
            aria-label="Open notifications"
            onClick={() =>
              navigate("/owner/notifications")
            }
            className="
              flex h-10 w-10 items-center
              justify-center rounded-full
              transition-colors hover:bg-black/10
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-black
            "
          >
            <img
              src={notificationIcon}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 sm:h-7 sm:w-7"
            />
          </button>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="
              flex h-11 w-11 items-center
              justify-center rounded-lg
              transition-colors hover:bg-black/10
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-black
            "
          >
            <MenuIcon
              className="
                h-8 w-8
                sm:h-9 sm:w-9
                lg:h-10 lg:w-10
              "
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Owner information */}
        <div
          className="
            absolute bottom-10 left-4 z-10
            flex items-center gap-3
            sm:bottom-14 sm:left-8 sm:gap-4
            lg:bottom-16 lg:left-12 lg:gap-5
            xl:left-16
          "
        >
          <img
            src="/OwnerProfile.png"
            alt="Kamal Silva"
            className="
              h-[68px] w-[68px]
              rounded-full border-2
              border-white object-cover
              shadow-md
              sm:h-[90px] sm:w-[90px]
              lg:h-[115px] lg:w-[115px]
            "
          />

          <div>
            <p
              className="
                text-[8px] font-normal
                leading-normal text-[#4b4b4b]
                sm:text-[10px]
                lg:text-[12px]
              "
            >
              Welcome Back
            </p>

            <h1
              className="
                text-[21px] font-semibold
                leading-tight text-black
                sm:text-[27px]
                lg:text-[36px]
              "
            >
              Kamal Silva
            </h1>
          </div>
        </div>

        <h2
          className="
            absolute bottom-0 left-4 z-10
            text-[20px] font-semibold
            leading-[1.6] text-black
            sm:left-8 sm:text-[24px]
            lg:left-12 lg:text-[30px]
            xl:left-16
          "
        >
          My Boats
        </h2>
      </header>

      {/* Dashboard content */}
      <div
        className="
          w-full px-4 pb-8
          sm:px-6 sm:pb-10
          lg:grid
          lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]
          lg:items-start lg:gap-6
          lg:px-10 lg:pb-12
          xl:grid-cols-[minmax(0,2.2fr)_minmax(340px,1fr)]
          xl:px-14
        "
      >
        {/* Boat cards */}
        <section
          aria-label="My boats"
          className="
            grid w-full grid-cols-1 gap-5
            md:grid-cols-2
            lg:gap-6
          "
        >
          {boats.map((boat) => (
            <article
              key={boat.id}
              className="
                w-full overflow-hidden
                rounded-[22px] bg-white p-3
                shadow-[0_6px_9px_rgba(0,0,0,0.22)]
                sm:p-4
              "
            >
              <div
                className="
                  grid
                  grid-cols-[minmax(0,0.8fr)_minmax(145px,1.2fr)]
                  items-center gap-3
                  sm:grid-cols-[minmax(130px,0.8fr)_minmax(210px,1.2fr)]
                  sm:gap-5
                  lg:grid-cols-[minmax(130px,0.8fr)_minmax(200px,1.2fr)]
                  xl:grid-cols-[minmax(150px,0.8fr)_minmax(240px,1.2fr)]
                "
              >
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold sm:text-[18px]">
                    Name
                  </p>

                  <p className="mt-1 truncate text-[16px] font-normal sm:text-[18px]">
                    {boat.name}
                  </p>

                  <p className="mt-3 text-[16px] font-semibold sm:text-[18px]">
                    Reg No
                  </p>

                  <p className="mt-1 text-[16px] font-normal sm:text-[18px]">
                    {boat.registrationNumber}
                  </p>

                  <div className="mt-3 flex items-center gap-1">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-[#20e620]"
                    />

                    <span className="text-[8px] font-medium uppercase text-[#20d820] sm:text-[9px]">
                      Approved
                    </span>
                  </div>
                </div>

                <img
                  src={boat.image}
                  alt={`${boat.name} boat`}
                  className="
                    h-[145px] w-full
                    rounded-[12px] object-cover
                    object-center
                    sm:h-[180px]
                    lg:h-[190px]
                    xl:h-[210px]
                  "
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/owner/boats/${boat.id}`)
                }
                className="
                  mt-3 flex min-h-9 w-full
                  items-center justify-center gap-1
                  rounded-[9px] bg-[#162d54]
                  px-4 py-2
                  text-[12px] font-normal
                  text-white
                  transition-colors
                  hover:bg-[#203d6c]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#162d54]
                  focus-visible:ring-offset-2
                  sm:min-h-10 sm:text-[13px]
                "
              >
                <span>Info</span>

                <img
                  src={infoIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 brightness-0 invert"
                />
              </button>
            </article>
          ))}
        </section>

        {/* Ongoing trips */}
        <section
          className="
            mt-5 w-full rounded-[24px]
            bg-white px-6 py-7
            shadow-[0_6px_12px_rgba(0,0,0,0.15)]
            sm:px-8 sm:py-8
            lg:mt-0
          "
        >
          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-[20px] font-medium sm:text-[24px] lg:text-[28px]">
              Ongoing Trips
            </h2>

            <img
              src={vesselIcon}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
          </div>

          <div className="flex flex-col gap-7">
            {ongoingTrips.map((trip) => (
              <article
                key={trip.id}
                className="flex items-center justify-between"
              >
                <div>
                  <h3 className="text-[14px] font-semibold sm:text-[16px] lg:text-[18px]">
                    {trip.boatName}
                  </h3>

                  <p className="text-[8px] font-normal sm:text-[9px] lg:text-[10px]">
                    {trip.registrationNumber}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`View ${trip.boatName} trip`}
                  onClick={() =>
                    navigate(
                      `/owner/trips/${trip.id}`,
                    )
                  }
                  className="
                    flex h-9 w-9 items-center
                    justify-center rounded-full
                    transition-colors hover:bg-gray-100
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#162d54]
                  "
                >
                  <img
                    src={infoIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain"
                  />
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Menu overlay */}
      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="
              fixed inset-0 z-40
              border-0 bg-black/25
            "
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Boat owner menu"
            className="
              fixed right-0 top-0 z-50
              min-h-dvh w-full
              overflow-y-auto bg-white
              px-8 pb-10 pt-5
              shadow-[-8px_0_24px_rgba(0,0,0,0.16)]
              sm:w-[390px] sm:px-10
              lg:w-[430px] lg:px-12
            "
          >
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  transition-colors hover:bg-gray-100
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#162d54]
                "
              >
                <X
                  className="h-6 w-6"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </button>
            </div>

            <nav
              aria-label="Boat owner navigation"
              className="mt-8 flex flex-col gap-2"
            >
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => openPage(item.path)}
                  className="
                    flex w-full items-center gap-6
                    rounded-xl px-3 py-4
                    text-left text-black
                    transition-colors hover:bg-gray-100
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#162d54]
                  "
                >
                  {item.type === "settings" ? (
                    <Settings
                      className="h-8 w-8 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  ) : (
                    <img
                      src={item.icon}
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 shrink-0 object-contain"
                    />
                  )}

                  <span className="text-[17px] font-semibold">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </aside>
        </>
      )}
    </main>
  );
}

export default BoatOwnerDashboard;
