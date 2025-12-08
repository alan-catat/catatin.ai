"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAlert } from "../ui/alert/Alert";
import Image from "next/image";
import DatePicker from "@/components/form/date-picker";

const convertDriveUrl = (url?: string) => {
  if (!url) return "/images/user/edit.png";
  if (url.includes("drive.google.com")) {
    const match = url.match(/[-\w]{25,}/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[0]}`;
  }
  return url;
};

export default function UserMetaCard({ profile }: { profile: any }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { setAlertData } = useAlert();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    email: profile?.email || "",
  });

  const [photoUrl, setPhotoUrl] = useState<string>(convertDriveUrl(profile?.photo_url));
  const [userEmail, setUserEmail] = useState<string | null>(profile?.email || null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  // Derived name parts
  const fullName = (formData.full_name || profile?.full_name || "").trim();
  const nameParts = fullName.split(" ");
  const firstNameDisplay = nameParts[0] || "-";
  const lastNameDisplay = nameParts.slice(1).join(" ") || "-";

  useEffect(() => {
    if (!profile) return;

    setFormData({
      full_name: profile.full_name || "",
      phone_number: profile.phone_number || "",
      date_of_birth: profile.date_of_birth || "",
      gender: profile.gender || "",
      email: profile.email || "",
    });

    setUserEmail(profile.email || null);
    setPhotoUrl(convertDriveUrl(profile.photo_url));
    setIsSuperAdmin(profile.role === "super_admin");
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);

    try {
      // ambil value input manual (defaultValue = uncontrolled)
      const firstName = (document.querySelector<HTMLInputElement>('input[name="firstName"]')?.value || "").trim();
      const lastName = (document.querySelector<HTMLInputElement>('input[name="lastName"]')?.value || "").trim();
      const countryCode = (document.querySelector<HTMLInputElement>('input[name="country_code"]')?.value || "").trim();
      const phoneNumberInput = (document.querySelector<HTMLInputElement>('input[name="phone_number"]')?.value || "").trim();
      const gender = (document.querySelector<HTMLSelectElement>('select[name="gender"]')?.value || "").trim();

      const dateOfBirth = formData.date_of_birth?.trim() || null;

      const instagram = (document.querySelector<HTMLInputElement>('input[name="instagram"]')?.value || "").trim();
      const facebook = (document.querySelector<HTMLInputElement>('input[name="facebook"]')?.value || "").trim();
      const tiktok = (document.querySelector<HTMLInputElement>('input[name="tiktok"]')?.value || "").trim();

      // Validation nama
      const effectiveFullName = (formData.full_name || `${firstName} ${lastName}`).trim();
      if (!effectiveFullName) {
        setAlertData({ variant: "error", title: "Validasi Gagal", message: "Nama lengkap wajib diisi." });
        setSaving(false);
        return;
      }

      // final phone
      let finalPhone = phoneNumberInput || formData.phone_number || profile?.phone_number || null;
      if (countryCode && finalPhone && !finalPhone.startsWith(countryCode)) {
        finalPhone = `${countryCode}${finalPhone}`;
      }

      // Upload file jika ada
      const fileInput = document.querySelector<HTMLInputElement>('input[name="profile_photo"]');
      const file = fileInput?.files?.[0];
      let uploadedUrl = profile?.photo_url || null;

      if (file) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("email", userEmail || profile?.email || "");

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_N8N_UPLOADPHOTO_URL}`, {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadRes.ok) throw new Error("Upload gagal");

        const raw = await uploadRes.text();
        let uploadData = null;

        try {
          uploadData = JSON.parse(raw);
        } catch {
          console.warn("⚠️ Upload API tidak mengembalikan JSON:", raw);
        }

        uploadedUrl = uploadData?.fileUrl || uploadedUrl;
      }

      // payload update
      const payload = {
        email: userEmail || profile?.email || "",
        first_name: firstName || nameParts[0] || "",
        last_name: lastName || nameParts.slice(1).join(" ") || "",
        phone_number: finalPhone || null,
        gender,
        date_of_birth: dateOfBirth,
        instagram,
        facebook,
        tiktok,
        photo_url: uploadedUrl,
        updated_at: new Date().toISOString(),
        user_id: profile?.user_id,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_UPDATEPROFILE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal update profil");

      // SUCCESS → tampilkan alert
      setAlertData({
        variant: "success",
        title: "Berhasil",
        message: "Profil berhasil diperbarui",
      });

      // REFRESH HANYA SEKALI
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err) {
      console.error("Update profile error:", err);

      setAlertData({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan profil",
      });

      setSaving(false);
    }
  };
const formatPhone = (phone?: string) => {
  if (!phone) return "-";
  return phone.replace(/^62/, "+62");
};

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
              className="w-full h-full object-cover"
              onError={() => setPhotoUrl("/images/user/edit.png")}
            />
          </div>

          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {fullName || "-"}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center xl:text-left">
              {profile?.email || "-"}
            </p>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-center xl:text-left">
              {formatPhone(profile?.phone_number || "-")}
            </p>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-[#DFD8E8] px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 lg:w-auto"
        >
          ✏️ Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Profil</h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Ubah data pribadi menjadi yang terbaru.</p>
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
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">Informasi Pribadi</h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
                  <div className="col-span-2">
                    <Label>Foto Profil</Label>
                    <input
                      type="file"
                      name="profile_photo"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-semibold hover:file:bg-gray-200 dark:file:bg-gray-700 dark:hover:file:bg-gray-600"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <Label>Nama Depan</Label>
                    <Input name="firstName" type="text" defaultValue={firstNameDisplay} placeholder="Enter first name" />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <Label>Nama Belakang</Label>
                    <Input name="lastName" type="text" defaultValue={lastNameDisplay} placeholder="Enter last name" />
                  </div>

                  <div className="col-span-2">
                    <Label>Alamat Email</Label>
                    <Input type="email" name="email" value={userEmail || ""} readOnly disabled />
                  </div>

                  <div className="col-span-2">
                    <Label>HP</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1 flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-gray-300 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">+</span>
                        <Input name="country_code" type="number" placeholder="+62" defaultValue="+62" className="rounded-l-none" />
                      </div>
                      <div className="col-span-2">
                        <Input name="phone_number" type="tel" defaultValue="" placeholder="81234567890" />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <Label>Jenis Kelamin</Label>
                    <select name="gender" className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800" defaultValue={formData.gender}>
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="L">Pria</option>
                      <option value="P">Wanita</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <DatePicker
                      id="date_of_birth"
                      label="Tanggal Lahir"
                      defaultDate={formData.date_of_birth}
                      placeholder="Masukan tanggal lahir"
                      onChange={([selectedDate]: any) => {
                        if (selectedDate) {
                          const formatted = selectedDate.toLocaleDateString("en-CA");
                          setFormData((prev: any) => ({ ...prev, date_of_birth: formatted }));
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

                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>Close</Button>

              {/* FIX: hanya submit, tanpa onClick */}
              <Button
                type="submit"
                size="sm"
                disabled={isSuperAdmin || saving}
              >
                {saving ? "Menyimpan..." : "Save Changes"}
              </Button>
            </div>

          </form>
        </div>
      </Modal>
    </div>
  );
}
