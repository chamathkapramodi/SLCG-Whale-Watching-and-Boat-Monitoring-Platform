import { useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/icon";

type CrewRole = "Life Saver" | "Coxswain" | "Diver";

interface ProfileFormData {
  nic: string;
  email: string;
  phone: string;
  role: CrewRole;
  address: string;
}

interface CertificateItem {
  id: number;
  title: string;
  fileName: string;
}

const initialCertificates: CertificateItem[] = [
  {
    id: 1,
    title: "Certificate of Divers",
    fileName: "Nimal.png",
  },
  {
    id: 2,
    title: "Life Saving Certificate",
    fileName: "",
  },
];

const BoatCrewProfile = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(
    "/profiles/man.jpg",
  );

  const [formData, setFormData] =
    useState<ProfileFormData>({
      nic: "091019029019",
      email: "xxx@gmail.com",
      phone: "+941234567",
      role: "Life Saver",
      address: "",
    });

  const [certificates, setCertificates] =
    useState<CertificateItem[]>(
      initialCertificates,
    );

  const [isRequestSent, setIsRequestSent] =
    useState(false);

  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setIsRequestSent(false);
  };

  const handleProfileImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      window.alert(
        "Please select a valid image file.",
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setIsRequestSent(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleCertificateUpload = (
    certificateId: number,
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      window.alert(
        "Please upload a PNG, JPG, JPEG or PDF file.",
      );
      event.target.value = "";
      return;
    }

    setCertificates((currentCertificates) =>
      currentCertificates.map((certificate) =>
        certificate.id === certificateId
          ? {
              ...certificate,
              fileName: selectedFile.name,
            }
          : certificate,
      ),
    );

    setIsRequestSent(false);
  };

  const handleCertificateDelete = (
    certificateId: number,
  ): void => {
    const selectedCertificate =
      certificates.find(
        (certificate) =>
          certificate.id === certificateId,
      );

    if (!selectedCertificate?.fileName) {
      return;
    }

    const confirmed = window.confirm(
      `Remove "${selectedCertificate.fileName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setCertificates((currentCertificates) =>
      currentCertificates.map((certificate) =>
        certificate.id === certificateId
          ? {
              ...certificate,
              fileName: "",
            }
          : certificate,
      ),
    );

    setIsRequestSent(false);
  };

  const handleRequestApproval = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (
      !formData.nic.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      window.alert(
        "Please complete all profile fields.",
      );
      return;
    }

    const hasCertificate = certificates.some(
      (certificate) =>
        certificate.fileName.trim() !== "",
    );

    if (!hasCertificate) {
      window.alert(
        "Please upload at least one certificate.",
      );
      return;
    }

    setIsRequestSent(true);

    window.alert(
      "Your profile approval request was submitted successfully.",
    );
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
          px-4
          pb-6
          pt-4
          shadow-2xl
          sm:min-h-[calc(100vh-40px)]
          sm:max-w-5xl
          sm:rounded-xl
          sm:px-7
          sm:pb-8
          lg:px-10
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

            <span className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full bg-red-500" />
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

        <form
          onSubmit={handleRequestApproval}
          className="mt-6"
        >
          {/* Profile picture and name */}
          <section className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profileImage}
                alt="Nimal Silva"
                onError={(event) => {
                  event.currentTarget.src =
                    "/man.png";
                }}
                className="
                  h-16
                  w-16
                  rounded-full
                  border
                  border-[#14223D]
                  object-cover
                  sm:h-20
                  sm:w-20
                "
              />

              <input
                id="profile-picture-input"
                type="file"
                accept="image/png,image/jpeg"
                onChange={
                  handleProfileImageChange
                }
                className="hidden"
              />

              <label
                htmlFor="profile-picture-input"
                aria-label="Change profile picture"
                title="Change profile picture"
                className="
                  absolute
                  bottom-0
                  right-0
                  flex
                  h-7
                  w-7
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  bg-[#142B57]
                  text-white
                  shadow-md
                  transition-transform
                  hover:scale-110
                "
              >
                <Icon
                  name="camera"
                  size={15}
                  className="
                    [&_*]:stroke-white
                    [&_*]:fill-white
                  "
                />
              </label>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Boat Crew Profile
              </p>

              <h1 className="mt-1 text-xl font-semibold text-[#111827] sm:text-2xl">
                Nimal Silva
              </h1>

              <div className="mt-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#20C928]" />

                <span className="text-[9px] font-medium uppercase text-[#20C928]">
                  Approved
                </span>
              </div>
            </div>
          </section>

          {/* Form fields */}
          <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NIC */}
            <div className="md:col-span-2">
              <label
                htmlFor="nic"
                className="text-sm font-semibold text-[#222222]"
              >
                NIC No.
              </label>

              <input
                id="nic"
                name="nic"
                type="text"
                value={formData.nic}
                onChange={handleInputChange}
                placeholder="Enter NIC number"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-[#14223D]
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-[#075AEE]
                "
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[#222222]"
              >
                Your Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-[#14223D]
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-[#075AEE]
                "
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-[#222222]"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+94XXXXXXXXX"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-[#14223D]
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-[#075AEE]
                "
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="text-sm font-semibold text-[#222222]"
              >
                Role
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="
                  mt-2
                  h-12
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-[#14223D]
                  outline-none
                  transition-colors
                  focus:border-[#075AEE]
                "
              >
                <option value="Life Saver">
                  Life Saver
                </option>

                <option value="Coxswain">
                  Coxswain
                </option>

                <option value="Diver">
                  Diver
                </option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-semibold text-[#222222]"
              >
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-[#14223D]
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-[#075AEE]
                "
              />
            </div>
          </section>

          {/* Certifications */}
          <section className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#222222] sm:text-base">
                Certifications
              </h2>

              <span className="text-[10px] text-slate-400">
                PNG, JPG or PDF
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {certificates.map(
                (certificate) => (
                  <article
                    key={certificate.id}
                    className="
                      flex
                      min-h-[64px]
                      items-center
                      justify-between
                      gap-4
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                    "
                  >
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-[#111827]">
                        {certificate.title}
                      </h3>

                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {certificate.fileName ||
                          "No file uploaded"}
                      </p>
                    </div>

                    <input
                      id={`certificate-${certificate.id}`}
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(event) =>
                        handleCertificateUpload(
                          certificate.id,
                          event,
                        )
                      }
                      className="hidden"
                    />

                    {certificate.fileName ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCertificateDelete(
                            certificate.id,
                          )
                        }
                        aria-label={`Delete ${certificate.title}`}
                        title="Delete certificate"
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          transition-colors
                          hover:bg-red-50
                        "
                      >
                        <Icon
                          name="delete"
                          size={18}
                          className="
                            [&_*]:stroke-[#FF0000]
                            [&_*]:fill-[#FF0000]
                          "
                        />
                      </button>
                    ) : (
                      <label
                        htmlFor={`certificate-${certificate.id}`}
                        aria-label={`Upload ${certificate.title}`}
                        title="Upload certificate"
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          cursor-pointer
                          items-center
                          justify-center
                          rounded-full
                          transition-colors
                          hover:bg-[#EEF3FF]
                        "
                      >
                        <Icon
                          name="document"
                          size={20}
                          className="[&_*]:stroke-[#14223D]"
                        />
                      </label>
                    )}
                  </article>
                ),
              )}
            </div>
          </section>

          {/* Request button */}
          <button
            type="submit"
            className={`
              mt-9
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              text-sm
              font-medium
              text-white
              transition-colors
              ${
                isRequestSent
                  ? "bg-[#20A54A]"
                  : "bg-[#10175E] hover:bg-[#1B267D]"
              }
            `}
          >
            <Icon
              name={
                isRequestSent
                  ? "confirm"
                  : "document"
              }
              size={18}
              className="
                [&_*]:stroke-white
                [&_*]:fill-white
              "
            />

            {isRequestSent
              ? "Approval Requested"
              : "Request Approval"}
          </button>
        </form>

        {/* Menu drawer */}
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
                    <button
                      type="button"
                      onClick={() =>
                        handleMenuNavigation(
                          "/crew",
                        )
                      }
                      className="
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
                        hover:bg-[#F3F6FC]
                      "
                    >
                      <Icon
                        name="vessel"
                        size={23}
                      />

                      Dashboard
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-5
                        rounded-lg
                        bg-[#F3F6FC]
                        px-3
                        py-4
                        text-left
                        text-sm
                        font-medium
                      "
                    >
                      <Icon
                        name="user"
                        size={23}
                      />

                      Profile
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        handleMenuNavigation(
                          "/crew/notifications",
                        )
                      }
                      className="
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
                        hover:bg-[#F3F6FC]
                      "
                    >
                      <Icon
                        name="notification"
                        size={23}
                      />

                      Notifications
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

export default BoatCrewProfile;