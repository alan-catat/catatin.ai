"use client";

import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAlert } from "../ui/alert/Alert";
import Image from "next/image";
import DatePicker from "@/components/form/date-picker";

export default function UserInfoCard({ profile }: { profile: any }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { setAlertData } = useAlert();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
  });
  const [photoUrl, setPhotoUrl] = useState<string>("/images/user/edit.png");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Pisahkan nama depan & belakang
  const fullName = profile?.full_name?.trim() || "-";
  const phoneNumber = profile?.phone_number?.trim() || "-";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "-";
  const lastName = nameParts.slice(1).join(" ") || "-";
    const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
  if (!profile) return;
  if (profile?.role === "super_admin") setIsSuperAdmin(true);

  // 🚀 Konversi URL Google Drive agar bisa dipakai di <Image />
  const url = profile?.photo_url || "/images/user/edit.png";
  let finalUrl = url;

  if (url.includes("drive.google.com")) {
    const match = url.match(/[-\w]{25,}/); // ambil ID Google Drive
    if (match) finalUrl = `https://drive.google.com/uc?export=view&id=${match[0]}`;
  }

  setPhotoUrl(finalUrl);
}, [profile]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
  try {
  if (!formData.full_name) {
    setAlertData({
      variant: "error",
      title: "Validasi Gagal",
      message: "Nama lengkap wajib diisi.",
    });
    return;
  }

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_N8N_UPDATEPROFILE_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: profile?.user_id,
        ...formData,
      }),
    });

    if (!res.ok) throw new Error("Gagal update profil");

    const data = await res.json();
    console.log("✅ Update response:", data);

    setAlertData({
      variant: "success",
      title: "Berhasil",
      message: "Profil berhasil diperbarui",
    });

    // ⚡ Optional: update UI langsung tanpa reload
    Object.assign(profile, formData);

    closeModal();
  } catch (error: any) {
    setAlertData({
      variant: "error",
      title: "Gagal Update",
      message: error.message || "Terjadi kesalahan",
    });
  }
  } finally {
    setSaving(false);
  }
};
<Button onClick={handleSave} disabled={isSuperAdmin}>
  {isSuperAdmin ? "Hanya Admin Lain yang Bisa Edit" : "Simpan"}
</Button>


  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image
  width={80}
  height={80}
  src={photoUrl}
  alt={profile?.full_name || "user"}
  onError={() => setPhotoUrl("/images/user/edit.png")}
/>
          </div>

          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {fullName}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.email || "-"}
              </p>
            </div>
          </div>
        </div>

        <button
                  onClick={openModal}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-[#A8E063] px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 lg:w-auto"
                >
                  ✏️ Edit
                </button>
      </div>

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
            <div className="custom-scrollbar h-[70vh] overflow-y-auto px-3 pb-6 space-y-6">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
                  <div className="col-span-2 sm:col-span-1">
                    <Label>First Name</Label>
                    <Input name="firstName" type="text" defaultValue={firstName} placeholder="Enter first name" />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <Label>Last Name</Label>
                    <Input name="lastName" type="text" defaultValue={lastName} placeholder="Enter last name" />
                  </div>

                  <div className="col-span-2">
                    <Label>Email Address</Label>
                    <Input type="email" name="email" value={userEmail || ""} readOnly disabled />
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

                  <div className="col-span-2 sm:col-span-1">
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

                  <div className="col-span-2 sm:col-span-1">
  <DatePicker
    id="date_of_birth"
    label="Date of Birth"
    defaultDate={formData.date_of_birth} // nilai awal dari data user
    placeholder="Select your birth date"
    onChange={([selectedDate]: any) => {
      if (selectedDate) {
        const formatted = selectedDate.toLocaleDateString("en-CA");

        // Simpan hasilnya ke formData (pastikan kamu punya setFormData)
        setFormData((prev: any) => ({
          ...prev,
          date_of_birth: formatted,
        }));
      }
    }}
  />
</div>


                  <div className="col-span-2 sm:col-span-1">
                    <Label>Instagram</Label>
                    <Input name="instagram" type="text" defaultValue={profile?.instagram || ""} placeholder="@username / URL" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label>Facebook</Label>
                    <Input name="facebook" type="text" defaultValue={profile?.facebook || ""} placeholder="Profile URL" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
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
