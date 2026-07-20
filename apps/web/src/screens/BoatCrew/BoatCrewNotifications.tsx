import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/icon";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  tripId?: number;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Trip Approved",
    message:
      "Your Mirissa King trip scheduled for 06:30 AM has been approved.",
    time: "5 minutes ago",
    isRead: false,
    tripId: 1,
  },
  {
    id: 2,
    title: "Upcoming Trip",
    message:
      "Your next trip is scheduled for tomorrow at 06:30 AM.",
    time: "1 hour ago",
    isRead: false,
    tripId: 2,
  },
  {
    id: 3,
    title: "Certificate Reminder",
    message:
      "Please check your boat crew certification expiry date.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: 4,
    title: "Trip Information Updated",
    message:
      "Passenger and departure information for Mirissa King has been updated.",
    time: "2 days ago",
    isRead: true,
    tripId: 3,
  },
];

const BoatCrewNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.isRead,
    ).length;
  }, [notifications]);

  const handleBack = (): void => {
    navigate("/crew");
  };

  const handleNotificationClick = (
    selectedNotification: NotificationItem,
  ): void => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === selectedNotification.id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );

    if (selectedNotification.tripId) {
      navigate(
        `/crew/trip-info/${selectedNotification.tripId}`,
      );
    }
  };

  const handleMarkAllAsRead = (): void => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  const handleClearAll = (): void => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all notifications?",
    );

    if (!confirmed) {
      return;
    }

    setNotifications([]);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FB] font-[Poppins] text-[#14223D]">
      {/* Header */}
      <header
        className="
          sticky
          top-0
          z-30
          flex
          min-h-[72px]
          w-full
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white
          px-4
          py-4
          sm:min-h-[80px]
          sm:px-6
          lg:px-10
        "
      >
        <button
          type="button"
          onClick={handleBack}
          aria-label="Return to boat crew dashboard"
          className="
            flex
            h-10
            items-center
            px-2
            text-sm
            font-medium
            text-[#14223D]
            transition-colors
            hover:bg-[#F4F6FA]
          "
        >
          Back
        </button>

        <div className="text-center">
          <h1 className="text-base font-semibold sm:text-xl">
            Notifications
          </h1>

          <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
            {unreadCount} unread
          </p>
        </div>

        <div className="relative flex h-10 w-10 items-center justify-center">
          <Icon name="notification" size={23} />

          {unreadCount > 0 && (
            <span
              className="
                absolute
                right-0
                top-0
                flex
                h-5
                min-w-5
                items-center
                justify-center
                bg-[#FF0000]
                px-1
                text-[9px]
                font-semibold
                text-white
              "
            >
              {unreadCount}
            </span>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {/* Page title and actions */}
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-6xl
            flex-col
            gap-4
            border-b
            border-slate-200
            pb-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">
              Recent Notifications
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              View your trip updates, approvals and reminders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="
                h-10
                border
                border-[#142B57]
                px-4
                text-xs
                font-medium
                text-[#142B57]
                transition-colors
                hover:bg-[#EEF3FF]
                disabled:cursor-not-allowed
                disabled:border-slate-300
                disabled:text-slate-400
                disabled:opacity-60
              "
            >
              Mark all as read
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="
                h-10
                bg-[#142B57]
                px-4
                text-xs
                font-medium
                text-white
                transition-colors
                hover:bg-[#203D73]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Notifications displayed one below another */}
        {notifications.length > 0 && (
          <section
            className="
              mx-auto
              mt-6
              flex
              w-full
              max-w-6xl
              flex-col
              border
              border-slate-200
              bg-white
            "
          >
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() =>
                  handleNotificationClick(notification)
                }
                className={`
                  relative
                  min-h-[140px]
                  w-full
                  border-b
                  border-slate-200
                  p-5
                  text-left
                  transition-colors
                  duration-200
                  last:border-b-0
                  hover:bg-[#F9FBFF]
                  sm:p-6
                  ${
                    notification.isRead
                      ? "bg-white"
                      : "bg-[#F4F8FF]"
                  }
                `}
              >
                {!notification.isRead && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      top-0
                      w-1
                      bg-[#075AEE]
                    "
                  />
                )}

                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      bg-[#EEF3FF]
                    "
                  >
                    <Icon
                      name="notification"
                      size={21}
                      className="[&_*]:stroke-[#075AEE]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm font-semibold text-[#14223D] sm:text-base">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 shrink-0 bg-[#075AEE]" />
                      )}
                    </div>

                    <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                      {notification.message}
                    </p>

                    <p className="mt-4 text-[10px] text-slate-400 sm:text-xs">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </section>
        )}

        {/* Empty notification state */}
        {notifications.length === 0 && (
          <section
            className="
              mx-auto
              mt-6
              flex
              min-h-[420px]
              w-full
              max-w-6xl
              flex-col
              items-center
              justify-center
              border
              border-slate-200
              bg-white
              px-5
              text-center
            "
          >
            <Icon
              name="notification"
              size={38}
              className="[&_*]:stroke-slate-400"
            />

            <h2 className="mt-5 text-lg font-semibold">
              No notifications
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
              New trip approvals, reminders and updates will appear
              here.
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="
                mt-6
                bg-[#142B57]
                px-6
                py-3
                text-xs
                font-medium
                text-white
                transition-colors
                hover:bg-[#203D73]
              "
            >
              Return to Dashboard
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default BoatCrewNotifications;