"use client";

import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAlert } from "../ui/alert/Alert";
import Image from "next/image";

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

        
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title="Edit Profil">
        <div className="flex flex-col gap-3">
          <Label>Nama Lengkap</Label>
          <Input name="full_name" value={formData.full_name} onChange={handleChange} />
          <Label>No. Telepon</Label>
          <Input name="phone_number" value={formData.phone_number} onChange={handleChange} />
          <Label>Tanggal Lahir</Label>
          <Input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
          <Label>Gender</Label>
          <Input name="gender" value={formData.gender} onChange={handleChange} />
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </Modal>
    </div>
  );
}
