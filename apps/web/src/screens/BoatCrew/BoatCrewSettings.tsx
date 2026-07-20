import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/icon";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const readBooleanSetting = (key: string, fallback: boolean): boolean => {
  const savedValue = localStorage.getItem(key);
  return savedValue === null ? fallback : savedValue === "true";
};

const BoatCrewSettings = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] =
    useState(false);

  const [appNotifications, setAppNotifications] =
    useState(() => readBooleanSetting("boatCrewAppNotifications", true));

  const [autoUpdates, setAutoUpdates] =
    useState(() => readBooleanSetting("boatCrewAutoUpdates", true));

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordForm, setPasswordForm] =
    useState<PasswordFormData>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const handleNotificationsChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const isEnabled = event.target.checked;

    setAppNotifications(isEnabled);

    localStorage.setItem(
      "boatCrewAppNotifications",
      String(isEnabled),
    );
  };

  const handleAutoUpdatesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const isEnabled = event.target.checked;

    setAutoUpdates(isEnabled);

    localStorage.setItem(
      "boatCrewAutoUpdates",
      String(isEnabled),
    );
  };

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string,
  ): void => {
    setPasswordForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handlePasswordSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    const currentPassword =
      passwordForm.currentPassword.trim();

    const newPassword =
      passwordForm.newPassword.trim();

    const confirmPassword =
      passwordForm.confirmPassword.trim();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      window.alert(
        "Please complete all password fields.",
      );
      return;
    }

    if (newPassword.length < 8) {
      window.alert(
        "The new password must contain at least 8 characters.",
      );
      return;
    }

    if (currentPassword === newPassword) {
      window.alert(
        "The new password must be different from the current password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      window.alert(
        "The new password and confirmation do not match.",
      );
      return;
    }

    window.alert(
      "Your password was updated successfully.",
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordModalOpen(false);
  };

  const handleLogout = (): void => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?",
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const handleDeleteAccount = (): void => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    const confirmationText = window.prompt(
      'Type "DELETE" to confirm.',
    );

    if (confirmationText !== "DELETE") {
      window.alert(
        "Account deletion was cancelled.",
      );
      return;
    }

    localStorage.clear();

    window.alert(
      "Your account deletion request was submitted.",
    );

    navigate("/");
  };

  const handleMenuNavigation = (
    path: string,
  ): void => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] font-[Poppins] sm:px-4 sm:py-5 lg:px-8">
      <main
        className="
          relative
          mx-auto
          min-h-screen
          w-full
          bg-white
          px-5
          pb-10
          pt-4
          shadow-2xl
          sm:min-h-[calc(100vh-40px)]
          sm:max-w-5xl
          sm:rounded-xl
          sm:px-8
          lg:px-12
        "
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/crew/notifications",
              )
            }
            aria-label="Open notifications"
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              transition-colors
              hover:bg-slate-100
            "
          >
            <Icon
              name="notification"
              size={22}
            />

            {appNotifications && (
              <span className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(true)
            }
            aria-label="Open menu"
            className="
              flex
              h-11
              w-11
              flex-col
              items-center
              justify-center
              gap-[5px]
              rounded-md
              transition-colors
              hover:bg-slate-100
            "
          >
            <span className="h-[3px] w-7 rounded-full bg-black" />
            <span className="h-[3px] w-7 rounded-full bg-black" />
            <span className="h-[3px] w-7 rounded-full bg-black" />
          </button>
        </header>

        {/* Page heading */}
        <section className="mt-7">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Boat Crew
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#14223D] sm:text-3xl">
            Settings
          </h1>
        </section>

        {/* Settings list */}
        <section className="mx-auto mt-7 w-full max-w-3xl">
          <SettingSwitch
            id="app-notifications"
            title="App Notifications"
            description="Receive mobile app notifications"
            checked={appNotifications}
            onChange={
              handleNotificationsChange
            }
          />

          <SettingSwitch
            id="auto-updates"
            title="Auto Updates"
            description="Automatically update when available"
            checked={autoUpdates}
            onChange={
              handleAutoUpdatesChange
            }
          />

          <SettingAction
            title="Password"
            description="Update your password"
            onClick={() =>
              setIsPasswordModalOpen(true)
            }
          />

          <SettingAction
            title="Need Help?"
            description="Contact our support center"
            onClick={() =>
              setIsHelpModalOpen(true)
            }
          />

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              min-h-[88px]
              w-full
              items-center
              border-b
              border-slate-200
              px-1
              py-5
              text-left
              transition-colors
              hover:bg-red-50
              sm:px-3
            "
          >
            <div>
              <h2 className="text-sm font-medium text-red-500 sm:text-base">
                Log Out
              </h2>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Log out from the Coast Guard platform
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="
              flex
              min-h-[88px]
              w-full
              items-center
              px-1
              py-5
              text-left
              transition-colors
              hover:bg-red-50
              sm:px-3
            "
          >
            <div>
              <h2 className="text-sm font-medium text-red-500 sm:text-base">
                Delete My Account
              </h2>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Permanently delete your account
              </p>
            </div>
          </button>
        </section>

        {/* Side menu */}
        {isMenuOpen && (
          <>
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(false)
              }
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/45"
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
                onClick={() =>
                  setIsMenuOpen(false)
                }
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
                  text-black
                  transition-colors
                  hover:bg-slate-100
                "
              >
                ×
              </button>

              <nav className="mt-14">
                <ul className="space-y-3">
                  <li>
                    <MenuButton
                      label="Dashboard"
                      icon="vessel"
                      onClick={() =>
                        handleMenuNavigation(
                          "/crew",
                        )
                      }
                    />
                  </li>

                  <li>
                    <MenuButton
                      label="Profile"
                      icon="user"
                      onClick={() =>
                        handleMenuNavigation(
                          "/crew/profile",
                        )
                      }
                    />
                  </li>

                  <li>
                    <MenuButton
                      label="Notifications"
                      icon="notification"
                      onClick={() =>
                        handleMenuNavigation(
                          "/crew/notifications",
                        )
                      }
                    />
                  </li>

                  <li>
                    <MenuButton
                      label="Settings"
                      icon="confirm"
                      active
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                    />
                  </li>
                </ul>
              </nav>
            </aside>
          </>
        )}

        {/* Password modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="password-modal-heading"
              className="
                max-h-[90vh]
                w-full
                max-w-md
                overflow-y-auto
                rounded-2xl
                bg-white
                p-6
                shadow-2xl
                sm:p-7
              "
            >
              <div className="flex items-center justify-between">
                <h2
                  id="password-modal-heading"
                  className="text-xl font-semibold text-[#14223D]"
                >
                  Update Password
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setIsPasswordModalOpen(
                      false,
                    )
                  }
                  aria-label="Close password modal"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-2xl hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={
                  handlePasswordSubmit
                }
                className="mt-6 space-y-5"
              >
                <PasswordInput
                  id="current-password"
                  label="Current Password"
                  value={
                    passwordForm.currentPassword
                  }
                  showPassword={
                    showCurrentPassword
                  }
                  onChange={(value) =>
                    handlePasswordChange(
                      "currentPassword",
                      value,
                    )
                  }
                  onToggleVisibility={() =>
                    setShowCurrentPassword(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                />

                <PasswordInput
                  id="new-password"
                  label="New Password"
                  value={
                    passwordForm.newPassword
                  }
                  showPassword={
                    showNewPassword
                  }
                  onChange={(value) =>
                    handlePasswordChange(
                      "newPassword",
                      value,
                    )
                  }
                  onToggleVisibility={() =>
                    setShowNewPassword(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                />

                <PasswordInput
                  id="confirm-password"
                  label="Confirm New Password"
                  value={
                    passwordForm.confirmPassword
                  }
                  showPassword={
                    showConfirmPassword
                  }
                  onChange={(value) =>
                    handlePasswordChange(
                      "confirmPassword",
                      value,
                    )
                  }
                  onToggleVisibility={() =>
                    setShowConfirmPassword(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                />

                <button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-[#10175E] text-sm font-medium text-white transition-colors hover:bg-[#1B267D]"
                >
                  Update Password
                </button>
              </form>
            </section>
          </div>
        )}

        {/* Help modal */}
        {isHelpModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-modal-heading"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
            >
              <div className="flex items-center justify-between">
                <h2
                  id="help-modal-heading"
                  className="text-xl font-semibold text-[#14223D]"
                >
                  Support Center
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setIsHelpModalOpen(false)
                  }
                  aria-label="Close support modal"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-2xl hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <a
                  href="mailto:support@coastguard.gov.lk"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-[#F9FBFF]"
                >
                  <Icon
                    name="document"
                    size={22}
                  />

                  <div>
                    <p className="text-sm font-medium text-[#14223D]">
                      Email Support
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      support@coastguard.gov.lk
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+94112345678"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-[#F9FBFF]"
                >
                  <Icon
                    name="info"
                    size={22}
                  />

                  <div>
                    <p className="text-sm font-medium text-[#14223D]">
                      Call Support
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      +94 11 234 5678
                    </p>
                  </div>
                </a>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

interface SettingSwitchProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

const SettingSwitch = ({
  id,
  title,
  description,
  checked,
  onChange,
}: SettingSwitchProps) => {
  return (
    <div
      className="
        flex
        min-h-[88px]
        items-center
        justify-between
        gap-5
        border-b
        border-slate-200
        px-1
        py-5
        sm:px-3
      "
    >
      <label
        htmlFor={id}
        className="min-w-0 flex-1 cursor-pointer"
      >
        <span className="block text-sm font-medium text-[#303030] sm:text-base">
          {title}
        </span>

        <span className="mt-1 block text-xs text-slate-400 sm:text-sm">
          {description}
        </span>
      </label>

      <label
        htmlFor={id}
        className="relative inline-flex shrink-0 cursor-pointer items-center"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />

        <span
          className={`
            relative
            block
            h-8
            w-[54px]
            rounded-full
            shadow-inner
            transition-colors
            duration-300
            ${
              checked
                ? "bg-[#2878F0]"
                : "bg-slate-300"
            }
          `}
        >
          <span
            className={`
              absolute
              top-1
              h-6
              w-6
              rounded-full
              bg-white
              shadow-md
              transition-all
              duration-300
              ${
                checked
                  ? "left-[26px]"
                  : "left-1"
              }
            `}
          />
        </span>
      </label>
    </div>
  );
};

interface SettingActionProps {
  title: string;
  description: string;
  onClick: () => void;
}

const SettingAction = ({
  title,
  description,
  onClick,
}: SettingActionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        min-h-[88px]
        w-full
        items-center
        justify-between
        gap-5
        border-b
        border-slate-200
        px-1
        py-5
        text-left
        transition-colors
        hover:bg-[#F9FBFF]
        sm:px-3
      "
    >
      <div>
        <h2 className="text-sm font-medium text-[#303030] sm:text-base">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
          {description}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="text-2xl font-light text-slate-400"
      >
        ›
      </span>
    </button>
  );
};

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

const PasswordInput = ({
  id,
  label,
  value,
  showPassword,
  onChange,
  onToggleVisibility,
}: PasswordInputProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#14223D]"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="
            h-12
            w-full
            rounded-xl
            border
            border-slate-200
            px-4
            pr-12
            text-sm
            text-[#14223D]
            outline-none
            transition-colors
            focus:border-[#2878F0]
          "
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="absolute inset-y-0 right-3 flex items-center justify-center"
        >
          <Icon
            name={
              showPassword
                ? "eyeoff"
                : "eye"
            }
            size={20}
          />
        </button>
      </div>
    </div>
  );
};

interface MenuButtonProps {
  label: string;
  icon:
    | "vessel"
    | "user"
    | "notification"
    | "confirm";
  active?: boolean;
  onClick: () => void;
}

const MenuButton = ({
  label,
  icon,
  active = false,
  onClick,
}: MenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
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
        transition-colors
        ${
          active
            ? "bg-[#F3F6FC] text-[#075AEE]"
            : "text-black hover:bg-[#F3F6FC]"
        }
      `}
    >
      <Icon
        name={icon}
        size={23}
        className={
          active
            ? "[&_*]:stroke-[#075AEE]"
            : "[&_*]:stroke-black"
        }
      />

      {label}
    </button>
  );
};

export default BoatCrewSettings;
