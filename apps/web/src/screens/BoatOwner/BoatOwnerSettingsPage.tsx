import {
  useEffect,
  useState,
} from "react";
import {
  ChevronRight,
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

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  type?: "settings";
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

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

function ToggleSwitch({
  label,
  checked,
  onChange,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={onChange}
      className="
        relative shrink-0 appearance-none
        rounded-full border-0 p-0
        transition-colors duration-200
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#162d54]
        focus-visible:ring-offset-2
      "
      style={{
        width: "53px",
        height: "30px",
        backgroundColor: checked
          ? "#2376eb"
          : "#d1d5db",
      }}
    >
      <span
        aria-hidden="true"
        className="
          absolute rounded-full
          bg-white
          shadow-[0_1px_4px_rgba(0,0,0,0.22)]
          transition-all duration-200
        "
        style={{
          width: "28px",
          height: "28px",
          top: "1px",
          left: checked ? "24px" : "1px",
        }}
      />
    </button>
  );
}

function BoatOwnerSettingsPage() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [appNotifications, setAppNotifications] =
    useState(true);
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isMenuOpen]);

  const openPage = (path: string): void => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = (): void => {
    /*
     * Connect your authentication logout function here.
     * For example:
     *
     * logout();
     */

    navigate("/login");
  };

  const handleDeleteAccount = (): void => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    /*
     * Send the account deletion request to
     * your backend API here later.
     */

    setStatusMessage(
      "Your account deletion request has been recorded.",
    );
  };

  return (
    <main className="boat-owner-page min-h-dvh w-full overflow-x-hidden bg-white text-black">
      {/* Top navigation */}
      <header
        className="
          relative z-30 flex w-full
          items-center justify-between
          bg-white px-5 py-5
          sm:px-8 sm:py-6
          lg:px-12 lg:py-7
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
            transition-colors hover:bg-gray-100
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#162d54]
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
            transition-colors hover:bg-gray-100
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#162d54]
          "
        >
          <MenuIcon
            className="h-8 w-8 sm:h-9 sm:w-9"
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </header>

      {/* Settings content */}
      <div
        className="
          mx-auto w-full max-w-[800px]
          px-6 pb-14 pt-7
          sm:px-10 sm:pt-10
          lg:px-12 lg:pt-12
        "
      >
        {/* App Notifications */}
        <section
          className="
            flex min-h-[100px] w-full
            items-center justify-between
            gap-5 border-b border-[#e6e6e6]
            sm:min-h-[115px]
          "
        >
          <div>
            <h1 className="text-[16px] font-normal sm:text-[18px] lg:text-[19px]">
              App Notifications
            </h1>

            <p className="mt-1 text-[13px] font-normal text-[#999999] sm:text-[14px]">
              Receive mobile app notifications
            </p>
          </div>

          <ToggleSwitch
            label="App notifications"
            checked={appNotifications}
            onChange={() => {
              setAppNotifications(
                (currentValue) => !currentValue,
              );
            }}
          />
        </section>

        {/* Automatic updates */}
        <section
          className="
            flex min-h-[100px] w-full
            items-center justify-between
            gap-5 border-b border-[#e6e6e6]
            sm:min-h-[115px]
          "
        >
          <div>
            <h2 className="text-[16px] font-normal sm:text-[18px] lg:text-[19px]">
              Auto Updates
            </h2>

            <p className="mt-1 text-[13px] font-normal text-[#999999] sm:text-[14px]">
              Automatically update when available
            </p>
          </div>

          <ToggleSwitch
            label="Automatic updates"
            checked={autoUpdates}
            onChange={() => {
              setAutoUpdates(
                (currentValue) => !currentValue,
              );
            }}
          />
        </section>

        {/* Password */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/owner/settings/password",
            )
          }
          className="
            flex min-h-[100px] w-full
            items-center justify-between
            gap-5 border-b border-[#e6e6e6]
            text-left transition-colors
            hover:bg-gray-50
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-[#162d54]
            sm:min-h-[115px]
          "
        >
          <div>
            <h2 className="text-[16px] font-normal sm:text-[18px] lg:text-[19px]">
              Password
            </h2>

            <p className="mt-1 text-[13px] font-normal text-[#999999] sm:text-[14px]">
              Update your password
            </p>
          </div>

          <ChevronRight
            className="h-6 w-6 shrink-0 text-[#bdbdbd]"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>

        {/* Help */}
        <button
          type="button"
          onClick={() =>
            navigate("/owner/support")
          }
          className="
            flex min-h-[100px] w-full
            items-center justify-between
            gap-5 border-b border-[#e6e6e6]
            text-left transition-colors
            hover:bg-gray-50
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-[#162d54]
            sm:min-h-[115px]
          "
        >
          <div>
            <h2 className="text-[16px] font-normal sm:text-[18px] lg:text-[19px]">
              Need Help?
            </h2>

            <p className="mt-1 text-[13px] font-normal text-[#999999] sm:text-[14px]">
              Contact our support center
            </p>
          </div>

          <ChevronRight
            className="h-6 w-6 shrink-0 text-[#bdbdbd]"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex min-h-[100px] w-full
            flex-col justify-center
            border-b border-[#e6e6e6]
            text-left transition-colors
            hover:bg-red-50
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-red-500
            sm:min-h-[115px]
          "
        >
          <span className="text-[16px] font-normal text-[#ff2424] sm:text-[18px]">
            Log Out
          </span>

          <span className="mt-1 text-[13px] font-normal text-[#999999] sm:text-[14px]">
            Log out from your account
          </span>
        </button>

        {/* Delete account */}
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="
            flex min-h-[100px] w-full
            flex-col justify-center
            text-left transition-colors
            hover:bg-red-50
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-red-500
            sm:min-h-[115px]
          "
        >
          <span className="text-[16px] font-normal text-[#ff2424] sm:text-[18px]">
            Delete My Account
          </span>

          <span className="mt-1 text-[13px] font-normal text-[#999999] sm:text-[14px]">
            Delete your SLCG account
          </span>
        </button>

        {statusMessage && (
          <p
            role="status"
            className="
              mt-5 rounded-lg bg-gray-100
              px-4 py-3 text-center
              text-[13px] font-medium
              text-[#162d54]
            "
          >
            {statusMessage}
          </p>
        )}
      </div>

      {/* Side menu */}
      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setIsMenuOpen(false)
            }
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
                onClick={() =>
                  setIsMenuOpen(false)
                }
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  transition-colors
                  hover:bg-gray-100
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
                  onClick={() =>
                    openPage(item.path)
                  }
                  className={`
                    flex w-full items-center gap-6
                    rounded-xl px-3 py-4
                    text-left transition-colors
                    hover:bg-gray-100
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#162d54]
                    ${
                      item.path ===
                      "/owner/settings"
                        ? "bg-gray-100 text-[#162d54]"
                        : "text-black"
                    }
                  `}
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
                      className="
                        h-8 w-8 shrink-0
                        object-contain
                      "
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

export default BoatOwnerSettingsPage;
