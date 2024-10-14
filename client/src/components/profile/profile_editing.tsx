import * as Tabs from "@radix-ui/react-tabs";
import * as Switch from "@radix-ui/react-switch";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ErrorDialog from "../ErrDialog";
import React, { useState } from "react";
import { IoMdPerson } from "react-icons/io";

export type ProfileProps = {
  onClickProfileSave: () => Promise<void>;
  avatar?: string | undefined;
  onChangeAvatar: (avatar: string) => void;
  firstName: string;
  onChangeFirstName: (firstName: string) => void;
  lastName: string;
  onChangeLastName: (lastName: string) => void;
  title?: string | undefined;
  onChangeTitle: (title: string) => void;
  gender?: string | undefined;
  onChangeGender: (title: string) => void;
  bio?: string | undefined;
  onChangeBio: (bio: string) => void;
};

export type PreferenceProps = {
  onClickPreferenceSave: () => Promise<void>;
  lang: string;
  onChangeLang: (lang: string) => void;
  timezone: string;
  onChangeTimezone: (timezone: string) => void;
  notification: boolean;
  onChangeNotification: (notification: boolean) => void;
  recommendation: boolean;
  onChangeRecommendation: (recommendation: boolean) => void;
};

export type SecurityProps = {
  onChangePassword: (password: string) => void;
  onChangeNewPassword: (newPassword: string) => void;
  onClickSecuritySave: () => Promise<void>;
  two_factor_auth: boolean;
  onChangeTwoFactorAuth: (two_factor_auth: boolean) => void;
};

export type EditingProps = ProfileProps & PreferenceProps & SecurityProps;

const ProfileEditing: React.FC<EditingProps> = ({
  // ProfileProps
  onClickProfileSave,
  avatar,
  onChangeAvatar,
  firstName,
  onChangeFirstName,
  lastName,
  onChangeLastName,
  title,
  onChangeTitle,
  gender,
  onChangeGender,
  bio,
  onChangeBio,
  // PreferenceProps
  onClickPreferenceSave,
  lang,
  onChangeLang,
  timezone,
  onChangeTimezone,
  notification,
  onChangeNotification,
  recommendation,
  onChangeRecommendation,
  // SecurityProps
  onChangePassword,
  onChangeNewPassword,
  onClickSecuritySave,
  two_factor_auth,
  onChangeTwoFactorAuth,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // alert dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // setAvatar(e.target!.result as string);
        onChangeAvatar(e.target!.result as string);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const textInputForm = (
    id: string,
    label: string,
    value: string | undefined,
    onChange: (value: string) => void,
    type: React.HTMLInputTypeAttribute = "text",
  ) => {
    const isTextarea = type === "textarea";
    const InputOrTextarea = isTextarea ? "textarea" : "input";

    return (
      <div>
        <label htmlFor={id} className="block text-xl font-medium">
          {label}
        </label>
        <InputOrTextarea
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={
            type === "textarea"
              ? "mt-1 block w-full border-2 sm:text-xl border-gray-300 rounded-lg p-2 h-32 focus:outline-none focus:border-blue-500 focus:border-2"
              : "mt-1 block w-full border-2 sm:text-xl border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 focus:border-2"
          }
        />
      </div>
    );
  };

  const selectInputForm = (
    id: string,
    label: string,
    value: string | undefined,
    onChange: (value: string) => void,
    options: { value: string; label: string }[],
  ) => {
    return (
      <div>
        <label htmlFor={id} className="block text-xl font-medium">
          {label}
        </label>
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full border-2 sm:text-xl border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:border-2"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const switchInputForm = (
    id: string,
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
  ) => {
    return (
      <div className="flex items-center">
        <Switch.Root
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          className="w-[42px] h-[25px] bg-blackA6 rounded-full relative bg-zinc-300 data-[state=checked]:bg-[#004E89] cursor-default"
        >
          <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
        <label htmlFor={id} className="text-xl ml-2">
          {label}
        </label>
      </div>
    );
  };

  const PasswordInputForm = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <label htmlFor={id} className="block text-xl font-medium">
          {label}
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full border-2 sm:text-xl border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:border-2"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-11 text-3xl text-gray-400"
        >
          {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      </div>
    );
  };

  const saveButton = (onClick: () => Promise<void>) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-opacity-90 self-end"
      >
        Save
      </button>
    );
  };

  const onClickSecuritySaveWrapper = async () => {
    // If password not strong enough
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter,  1 number, and be at least 8 characters long.",
      );
      setIsDialogOpen(true);
      return;
    }
    // If newPassword != confirmed password
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation password do not match.");
      setIsDialogOpen(true);
      return;
    }
    // If current password is empty
    if (currentPassword === "") {
      setErrorMessage("Current password cannot be empty.");
      setIsDialogOpen(true);
      return;
    }
    onChangePassword(currentPassword);
    onChangeNewPassword(newPassword);
    await onClickSecuritySave();
  };

  return (
    <>
      <Tabs.Root defaultValue="editProfile">
        <Tabs.List className="flex space-x-10 pt-5 pl-3 border-b">
          {[
            { value: "editProfile", label: "Edit Profile" },
            { value: "preferences", label: "Preferences" },
            { value: "security", label: "Security" },
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 text-xl font-medium text-blue-800
                      focus:outline-none
                      hover:border-b-blue-500 hover:text-blue-500
                      [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-blue-500 [&[data-state='active']]:text-blue-500"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="flex flex-col m-auto max-w-[1000px]">
          <Tabs.Content value="editProfile" className="p-6 space-y-8">
            {/* Avatar */}
            <div className="w-full flex-col flex items-center">
              <div className="relative w-32 h-32 rounded-full flex justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="object-cover" />
                ) : (
                  <IoMdPerson className="h-full w-full  text-zinc-500 bg-zinc-300" />
                )}
                <button
                  className="absolute bottom-0 text-white transform translate-x w-full text-sm bg-zinc-500 opacity-90"
                  onClick={() =>
                    document.getElementById("avatarInput")!.click()
                  }
                >
                  Edit
                </button>
                {/* Hide below input use button to click below input */}
                <input
                  id="avatarInput"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* List of personal info */}
            <div className="w-full">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {textInputForm(
                  "firstName",
                  "First Name",
                  firstName,
                  onChangeFirstName,
                )}
                {textInputForm(
                  "lastName",
                  "Last Name",
                  lastName,
                  onChangeLastName,
                )}
                {selectInputForm("title", "Title", title, onChangeTitle, [
                  { value: "", label: "Select a title" },
                  { value: "Mr", label: "Mr" },
                  { value: "Ms", label: "Ms" },
                  { value: "Dr", label: "Dr" },
                  { value: "Prof", label: "Prof" },
                ])}
                {selectInputForm("gender", "Gender", gender, onChangeGender, [
                  { value: "", label: "Select gender" },
                  { value: "female", label: "Female" },
                  { value: "male", label: "Male" },
                  { value: "non-binary", label: "Non-binary" },
                ])}
                <div className="md:col-span-2">
                  {textInputForm("bio", "Bio", bio, onChangeBio, "textarea")}
                </div>

                <div className="md:col-span-2 flex justify-end">
                  {saveButton(onClickProfileSave)}
                </div>
              </form>
            </div>
          </Tabs.Content>

          <Tabs.Content value="preferences" className="p-6 space-y-8">
            <div className="w-full">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectInputForm(
                  "lang",
                  "Preferred language",
                  lang,
                  onChangeLang,
                  [
                    { value: "", label: "Select your preferred language" },
                    { value: "English", label: "English" },
                    { value: "Mandarin", label: "Mandarin" },
                    { value: "Korean", label: "Korean" },
                  ],
                )}
                {selectInputForm(
                  "timezone",
                  "Time Zone",
                  timezone,
                  onChangeTimezone,
                  [
                    { value: "", label: "Select Time Zone" },
                    {
                      value: "AEST",
                      label: "Australian Eastern Standard Time (AEST)",
                    },
                  ],
                )}
                <div className="flex items-center md:col-span-2">
                  {switchInputForm(
                    "notification",
                    "Receive notifications for announcements",
                    notification,
                    onChangeNotification,
                  )}
                </div>
                <div className="flex items-center md:col-span-2">
                  {switchInputForm(
                    "recommendation",
                    "Get recommendations for courses",
                    recommendation,
                    onChangeRecommendation,
                  )}
                </div>

                <div className="md:col-span-2 flex justify-end">
                  {saveButton(onClickPreferenceSave)}
                </div>
              </form>
            </div>
          </Tabs.Content>

          <Tabs.Content value="security" className="p-6 space-y-8">
            <div className="w-full">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center md:col-span-2">
                  {switchInputForm(
                    "auth",
                    "Enable or disable two factor authentication",
                    two_factor_auth,
                    onChangeTwoFactorAuth,
                  )}
                </div>

                <div className="md:col-span-2 relative max-w-[600px]">
                  {PasswordInputForm(
                    "current-password",
                    "Current Password",
                    currentPassword,
                    setCurrentPassword,
                  )}
                </div>
                <div className="md:col-span-2 relative max-w-[600px]">
                  {PasswordInputForm(
                    "new-password",
                    "New Password",
                    newPassword,
                    setNewPassword,
                  )}
                </div>
                <div className="md:col-span-2 relative max-w-[600px]">
                  {PasswordInputForm(
                    "confirm-password",
                    "Confirm your new password",
                    confirmPassword,
                    setConfirmPassword,
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end">
                  {saveButton(onClickSecuritySaveWrapper)}
                </div>
              </form>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>

      <ErrorDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default ProfileEditing;
