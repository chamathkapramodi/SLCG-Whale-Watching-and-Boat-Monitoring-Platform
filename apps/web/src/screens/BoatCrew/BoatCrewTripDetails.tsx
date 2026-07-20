import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "../../components/ui/icon";
import { useOperations } from "../../operations/useOperations";

type PassengerAgeGroup = "Child" | "Adult" | "Senior";
type SortOption = "name" | "age" | "nationality";

interface TripInformation {
  id: string;
  boatName: string;
  registrationNumber: string;
  departureTime: string;
  departureDate: string;
  approval: string;
  qrCode: string;
  mapImage: string;
}

interface Passenger {
  id: number;
  name: string;
  nicOrPassport: string;
  age: PassengerAgeGroup;
  nationality: string;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionEvent;

type SpeechEnabledWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};
const seedTrips: TripInformation[] = [
  {
    id: "1",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    departureTime: "06:30 AM",
    departureDate: "Tue, 23 June",
    approval: "Approved",
    qrCode: "QR.png",
    mapImage: "/boatcrew/mirissa-vessel-map.jpg",
  },
  {
    id: "2",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    departureTime: "06:30 AM",
    departureDate: "Wed, 24 June",
    approval: "Approved",
    qrCode: "QR.png",
    mapImage: "/boatcrew/mirissa-vessel-map.jpg",
  },
  {
    id: "3",
    boatName: "Mirissa King",
    registrationNumber: "SL-WB-2047",
    departureTime: "06:30 AM",
    departureDate: "Thu, 25 June",
    approval: "Approved",
    qrCode: "QR.png",
    mapImage: "/boatcrew/mirissa-vessel-map.jpg",
  },
];

const passengers: Passenger[] = [
  {
    id: 1,
    name: "Rathnayake M.",
    nicOrPassport: "200323131313",
    age: "Adult",
    nationality: "Local",
  },
  {
    id: 2,
    name: "Perera N.",
    nicOrPassport: "199823456789",
    age: "Adult",
    nationality: "Local",
  },
  {
    id: 3,
    name: "Silva K.",
    nicOrPassport: "200145678912",
    age: "Adult",
    nationality: "Local",
  },
  {
    id: 4,
    name: "Fernando A.",
    nicOrPassport: "P78451236",
    age: "Senior",
    nationality: "British",
  },
  {
    id: 5,
    name: "Williams J.",
    nicOrPassport: "P96321478",
    age: "Adult",
    nationality: "Australian",
  },
  {
    id: 6,
    name: "Kumara D.",
    nicOrPassport: "201023456781",
    age: "Child",
    nationality: "Local",
  },
  {
    id: 7,
    name: "Jayasinghe S.",
    nicOrPassport: "199745612389",
    age: "Adult",
    nationality: "Local",
  },
  {
    id: 8,
    name: "Anderson R.",
    nicOrPassport: "P23698541",
    age: "Senior",
    nationality: "American",
  },
  {
    id: 9,
    name: "Dissanayake P.",
    nicOrPassport: "200056781234",
    age: "Adult",
    nationality: "Local",
  },
  {
    id: 10,
    name: "Thomas E.",
    nicOrPassport: "P74125896",
    age: "Child",
    nationality: "Canadian",
  },
  {
    id: 11,
    name: "Gunawardena T.",
    nicOrPassport: "199912345678",
    age: "Adult",
    nationality: "Local",
  },
  {
    id: 12,
    name: "Martin L.",
    nicOrPassport: "P85214796",
    age: "Adult",
    nationality: "French",
  },
];

const ageOrder: Record<PassengerAgeGroup, number> = {
  Child: 1,
  Adult: 2,
  Senior: 3,
};

const TripInfo = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const { trips: sharedTrips } = useOperations();

  const [searchValue, setSearchValue] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("name");
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);
  const [mapImageError, setMapImageError] = useState(false);

  const apiTrip = sharedTrips.find((trip) => trip.id === tripId);
  const selectedTrip: TripInformation | undefined = apiTrip ? (() => {
    const departure = new Date(apiTrip.scheduledDepartureUtc);
    return { id: apiTrip.id, boatName: apiTrip.vesselName, registrationNumber: apiTrip.registrationNumber,
      departureTime: departure.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }),
      departureDate: departure.toLocaleDateString("en-LK", { weekday: "short", day: "numeric", month: "long" }),
      approval: apiTrip.shoreApproval, qrCode: "QR.png", mapImage: "/boatcrew/mirissa-vessel-map.jpg" };
  })() : seedTrips.find((trip) => trip.id === tripId);

  const filteredAndSortedPassengers = useMemo(() => {
    const searchTerm = searchValue.trim().toLowerCase();

    const filteredPassengers = passengers.filter((passenger) => {
      return (
        passenger.name.toLowerCase().includes(searchTerm) ||
        passenger.nicOrPassport
          .toLowerCase()
          .includes(searchTerm) ||
        passenger.age.toLowerCase().includes(searchTerm) ||
        passenger.nationality
          .toLowerCase()
          .includes(searchTerm)
      );
    });

    return [...filteredPassengers].sort(
      (firstPassenger, secondPassenger) => {
        switch (sortOption) {
          case "age":
            return (
              ageOrder[firstPassenger.age] -
              ageOrder[secondPassenger.age]
            );

          case "nationality":
            return firstPassenger.nationality.localeCompare(
              secondPassenger.nationality,
            );

          case "name":
          default:
            return firstPassenger.name.localeCompare(
              secondPassenger.name,
            );
        }
      },
    );
  }, [searchValue, sortOption]);

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchValue(event.target.value);
  };

  const handleSortChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    setSortOption(event.target.value as SortOption);
  };

  const handleVoiceSearch = (): void => {
  const speechWindow = window as SpeechEnabledWindow;

  const SpeechRecognitionAPI =
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) {
    window.alert(
      "Voice search is not supported in this browser. Please use Google Chrome or Microsoft Edge.",
    );
    return;
  }

  const recognition = new SpeechRecognitionAPI();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.onerror = () => {
    setIsListening(false);

    window.alert(
      "Voice recognition was unsuccessful. Please check your microphone permission and try again.",
    );
  };

  recognition.onresult = (event) => {
    const spokenText =
      event.results[0]?.[0]?.transcript?.trim() ?? "";

    if (spokenText) {
      setSearchValue(spokenText);
    }
  };

  recognition.start();
};

  const handleEmergencyRequest = (): void => {
    const confirmed = window.confirm(
      "Are you sure you want to request emergency assistance?",
    );

    if (!confirmed) {
      return;
    }

    window.alert(
      "Emergency request sent to the Coast Guard operations room.",
    );
  };

  if (!selectedTrip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1F1F1F] px-4 py-6 font-[Poppins]">
        <main className="w-full max-w-lg bg-white p-8 text-center shadow-lg sm:rounded-xl">
          <Icon name="info" size={34} className="mx-auto" />

          <h1 className="mt-4 text-xl font-semibold text-[#14223D]">
            Trip not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The selected trip information is unavailable.
          </p>

          <button
            type="button"
            onClick={() => navigate("/crew")}
            className="mt-6 bg-[#142B57] px-6 py-3 text-sm text-white transition-colors hover:bg-[#203D73]"
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] font-[Poppins] sm:px-4 sm:py-5 lg:px-6">
      <main className="relative mx-auto min-h-screen w-full bg-white px-4 pb-6 pt-4 shadow-xl sm:min-h-[calc(100vh-40px)] sm:max-w-6xl sm:rounded-xl sm:px-6 sm:pb-8 lg:px-10">
        {/* Top navigation */}
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/crew/notifications")}
            aria-label="Open notifications"
            className="relative flex h-11 w-11 items-center justify-center transition-colors hover:bg-slate-100 sm:rounded-full"
          >
            <Icon name="notification" size={22} />

            <span className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] transition-colors hover:bg-slate-100 sm:rounded-md"
          >
            <span className="h-[3px] w-7 rounded-full bg-black" />
            <span className="h-[3px] w-7 rounded-full bg-black" />
            <span className="h-[3px] w-7 rounded-full bg-black" />
          </button>
        </header>

        {/* Trip summary */}
        <section className="mt-5 grid grid-cols-[minmax(0,1fr)_110px] items-center gap-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:gap-8 lg:grid-cols-[minmax(0,1fr)_230px]">
          <div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                Boat
              </p>

              <h1 className="mt-1 text-base font-normal text-[#374151] sm:text-lg">
                {selectedTrip.boatName}
              </h1>

              <p className="mt-1 text-[10px] text-slate-400">
                {selectedTrip.registrationNumber}
              </p>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-[#111827]">
                Time
              </p>

              <p className="mt-1 text-sm text-[#374151] sm:text-base">
                {selectedTrip.departureTime}
              </p>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-[#111827]">
                Date
              </p>

              <p className="mt-1 text-sm text-[#374151] sm:text-base">
                {selectedTrip.departureDate}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#20C928]" />

              <span className="text-[8px] font-medium uppercase text-[#20C928] sm:text-[9px]">
                {selectedTrip.approval}
              </span>
            </div>
          </div>

          {qrImageError ? (
            <div className="flex aspect-square w-full items-center justify-center border border-slate-200 bg-slate-50 text-center text-xs text-slate-400">
              QR code image
            </div>
          ) : (
            <img
              src={selectedTrip.qrCode}
              alt={`QR code for ${selectedTrip.boatName}`}
              onError={() => setQrImageError(true)}
              className="aspect-square w-full object-contain"
            />
          )}
        </section>

        {/* Passenger information */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827] sm:text-xl">
              Passenger Info
            </h2>

            <p className="text-[10px] text-slate-400 sm:text-xs">
              {filteredAndSortedPassengers.length} passengers
            </p>
          </div>

          {/* Search and sorting controls */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Icon
                  name="search"
                  size={16}
                  className="[&_*]:stroke-slate-500"
                />
              </div>

              <input
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search"
                aria-label="Search passengers"
                className="h-11 w-full border border-slate-200 bg-[#F9FBFF] pl-10 pr-12 text-xs text-[#14223D] outline-none transition-colors focus:border-[#075AEE]"
              />

              <button
                type="button"
                onClick={handleVoiceSearch}
                aria-label="Search passengers using microphone"
                title={isListening ? "Listening..." : "Voice search"}
                className={`absolute inset-y-0 right-3 flex items-center ${
                  isListening
                    ? "text-red-500"
                    : "text-slate-500 hover:text-[#075AEE]"
                }`}
              >
                <Icon
                  name="mic"
                  size={17}
                  className={
                    isListening
                      ? "[&_*]:stroke-red-500"
                      : "[&_*]:stroke-slate-500"
                  }
                />
              </button>
            </div>

            <div className="flex h-11 w-full items-center bg-[#F9FBFF] px-3 sm:w-[190px]">
              <span className="whitespace-nowrap text-[10px] text-slate-400">
                Sort by:
              </span>

              <select
                value={sortOption}
                onChange={handleSortChange}
                aria-label="Sort passengers"
                className="h-full w-full cursor-pointer bg-transparent pl-2 text-xs font-medium text-[#14223D] outline-none"
              >
                <option value="name">Name</option>
                <option value="age">Age</option>
                <option value="nationality">
                  Nationality
                </option>
              </select>
            </div>
          </div>

          {/* Scrollable passenger table */}
          <div className="mt-4 border border-slate-100">
            <div className="max-h-[290px] w-full overflow-auto sm:max-h-[340px]">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-slate-200 text-[10px] font-medium text-slate-500">
                    <th className="px-4 py-4">Name</th>

                    <th className="px-4 py-4">
                      NIC or Passport
                    </th>

                    <th className="px-4 py-4">Age</th>

                    <th className="px-4 py-4">
                      Nationality
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAndSortedPassengers.map(
                    (passenger) => (
                      <tr
                        key={passenger.id}
                        className="border-b border-slate-100 text-[10px] text-[#374151] transition-colors last:border-b-0 hover:bg-[#F9FBFF] sm:text-xs"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-[#14223D]">
                          {passenger.name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {passenger.nicOrPassport}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {passenger.age}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {passenger.nationality}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>

              {filteredAndSortedPassengers.length === 0 && (
                <div className="flex min-h-[180px] items-center justify-center px-5 text-center">
                  <div>
                    <Icon
                      name="search"
                      size={26}
                      className="mx-auto [&_*]:stroke-slate-400"
                    />

                    <p className="mt-3 text-sm font-medium text-[#14223D]">
                      No passengers found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try a different search.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Emergency button */}
        <button
          type="button"
          onClick={handleEmergencyRequest}
          className="mt-6 flex h-14 w-full items-center justify-center gap-3 bg-[#FF1010] text-sm font-medium text-white transition-colors hover:bg-red-700 sm:text-base"
        >
          Request Emergencies

          <Icon
            name="notification"
            size={19}
            className="[&_*]:stroke-white"
          />
        </button>

        {/* Map */}
        <section className="mt-5">
          {mapImageError ? (
            <div className="flex min-h-[300px] w-full items-center justify-center border border-slate-200 bg-slate-100 text-sm text-slate-400">
              Vessel map image
            </div>
          ) : (
            <img
              src={selectedTrip.mapImage}
              alt="Mirissa vessel traffic map"
              onError={() => setMapImageError(true)}
              className="max-h-[520px] w-full object-cover sm:object-contain"
            />
          )}
        </section>

        {/* Menu drawer */}
        {isMenuOpen && (
          <>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/45"
            />

            <aside className="fixed right-0 top-0 z-50 h-screen w-[280px] border-l-2 border-[#8B3DFF] bg-white px-7 py-7 shadow-2xl sm:w-[320px]">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-2xl text-black transition-colors hover:bg-slate-100"
              >
                ×
              </button>

              <nav className="mt-14">
                <ul className="space-y-3">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/crew");
                      }}
                      className="flex w-full items-center gap-5 px-3 py-4 text-left text-sm font-medium transition-colors hover:bg-[#F3F6FC]"
                    >
                      <Icon name="user" size={23} />
                      Dashboard
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/crew/notifications");
                      }}
                      className="flex w-full items-center gap-5 px-3 py-4 text-left text-sm font-medium transition-colors hover:bg-[#F3F6FC]"
                    >
                      <Icon name="notification" size={23} />
                      Notifications
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex w-full items-center gap-5 px-3 py-4 text-left text-sm font-medium transition-colors hover:bg-[#F3F6FC]"
                    >
                      <Icon name="info" size={23} />
                      Trip Information
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
          </>
        )}
      </main>
    </div>
  );
};

export default TripInfo;
