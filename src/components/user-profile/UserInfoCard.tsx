"use client";

import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAlert } from "../ui/alert/Alert";

export default function UserInfoCard({ profile }: { profile: any }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { setAlertData } = useAlert();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    email: profile?.email || "",
  });

  const fullName = formData.full_name.trim();
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "-";
  const lastName = nameParts.slice(1).join(" ") || "-";

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("/images/user/edit.png");

  // Konversi link Google Drive agar bisa tampil di <Image/>
  const convertDriveUrl = (url: string) => {
    if (!url) return "/images/user/edit.png";
    const match = url.match(/[-\w]{25,}/);
    return match
      ? `https://drive.google.com/uc?export=view&id=${match[0]}`
      : url;
  };

  useEffect(() => {
    if (profile?.email) setUserEmail(profile.email);
    if (profile?.photo_url) setPhotoUrl(convertDriveUrl(profile.photo_url));
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const firstName = (document.querySelector<HTMLInputElement>('input[name="firstName"]')?.value || "").trim();
      const lastName = (document.querySelector<HTMLInputElement>('input[name="lastName"]')?.value || "").trim();
      const countryCode = (document.querySelector<HTMLInputElement>('input[name="country_code"]')?.value || "").trim();
      const phoneNumber = (document.querySelector<HTMLInputElement>('input[name="phone_number"]')?.value || "").trim();
      const gender = (document.querySelector<HTMLSelectElement>('select[name="gender"]')?.value || "").trim();
      const dateOfBirth = (document.querySelector<HTMLInputElement>('input[name="date_of_birth"]')?.value || "").trim();
      const instagram = (document.querySelector<HTMLInputElement>('input[name="instagram"]')?.value || "").trim();
      const facebook = (document.querySelector<HTMLInputElement>('input[name="facebook"]')?.value || "").trim();
      const tiktok = (document.querySelector<HTMLInputElement>('input[name="tiktok"]')?.value || "").trim();

      let finalPhone = phoneNumber;
      if (countryCode && !phoneNumber.startsWith(countryCode)) {
        finalPhone = `${countryCode}${phoneNumber}`;
      }

      const fileInput = document.querySelector<HTMLInputElement>('input[name="profile_photo"]');
      const file = fileInput?.files?.[0];
      let uploadedUrl = profile?.photo_url || null;

      // Upload ke Google Drive via n8n
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("email", userEmail || profile?.email || "");

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_N8N_UPLOADPHOTO_URL}`, {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("Upload gagal");
        const uploadData = await uploadRes.json();
        uploadedUrl = uploadData?.fileUrl || uploadedUrl;
      }

      // Kirim update ke n8n
      const payload = {
        email: userEmail || profile?.email || "",
        first_name: firstName,
        last_name: lastName,
        phone_number: finalPhone || null,
        gender: gender || null,
        date_of_birth: dateOfBirth || null,
        instagram: instagram || null,
        facebook: facebook || null,
        tiktok: tiktok || null,
        photo_url: uploadedUrl,
        updated_at: new Date().toISOString(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_UPDATEPROFILE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal update profil");

      await res.text(); // aman walau kosong

      setAlertData({
        variant: "success",
        title: "Berhasil",
        message: "Profil berhasil diperbarui",
      });

      closeModal();
      window.location.reload(); // refresh supaya sinkron dengan halaman lain
    } catch (err: any) {
      console.error("Update profile error:", err);
      setAlertData({
        variant: "error",
        title: "Gagal Update",
        message: err.message || "Terjadi kesalahan",
      });
    }
  };


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">First Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{firstName}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Last Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{lastName}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email address</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userEmail || "-"}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formData.phone_number || "-"}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Gender</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formData.gender === "L"
                  ? "male"
                  : formData.gender === "P"
                  ? "female"
                  : "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formData.date_of_birth || "-"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 lg:w-auto"
        >
          ✏️ Edit
        </button>
      </div>

      {/* === MODAL EDIT === */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <Input name="firstName" type="text" defaultValue={firstName} placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input name="lastName" type="text" defaultValue={lastName} placeholder="Enter last name" />
                  </div>
                  <div>
                    <Label>Email Address</Label><Input type="email" name="email" value={userEmail || ""} readOnly disabled />

                  </div>
                  <div className="col-span-2">
                    <Label>Phone</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1 flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-gray-300 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                          +
                        </span>
                        <Input name="country_code" type="number" placeholder="62" defaultValue="62" className="rounded-l-none" />
                      </div>
                      <div className="col-span-2">
                        <Input name="phone_number" type="tel" defaultValue={formData.phone_number} placeholder="81234567890" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <select
                      name="gender"
                      className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
                      defaultValue={formData.gender}
                    >
                      <option value="">Select gender</option>
                      <option value="L">Male</option>
                      <option value="P">Female</option>
                    </select>
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    <Input name="date_of_birth" type="date" defaultValue={formData.date_of_birth} />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input name="instagram" type="text" defaultValue={profile?.instagram || ""} placeholder="@username / URL" />
                  </div>
                  <div>
                    <Label>Facebook</Label>
                    <Input name="facebook" type="text" defaultValue={profile?.facebook || ""} placeholder="Profile URL" />
                  </div>
                  <div>
                    <Label>TikTok</Label>
                    <Input name="tiktok" type="text" defaultValue={profile?.tiktok || ""} placeholder="@username / URL" />
                  </div>

                  <div className="col-span-2">
                    <Label>Profile Photo</Label>
                    <input
                      type="file"
                      name="profile_photo"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-semibold hover:file:bg-gray-200 dark:file:bg-gray-700 dark:hover:file:bg-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button type="submit" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
