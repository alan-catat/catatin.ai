"use client"

import React, { useState, useEffect } from "react"
import { useModal } from "../../hooks/useModal"
import { Modal } from "../ui/modal"
import Button from "../ui/button/Button"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import { useAlert } from "../ui/alert/Alert"

export default function UserSocialCard({ profile }: { profile: any }) {
  const { isOpen, openModal, closeModal } = useModal()
  const { setAlertData } = useAlert()

  const [formData, setFormData] = useState({
    phone_number: profile?.phone_number || "",
    instagram: profile?.instagram || "",
    facebook: profile?.facebook || "",
    tiktok: profile?.tiktok || "",
  })

  const [userEmail, setUserEmail] = useState<string | null>(profile?.email ?? null)

  // Ambil profile dari n8n (opsional kalau belum disediakan)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userLocal.email) {
        console.warn("Email user tidak ditemukan di localStorage");
        return;
      }
        const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_GETPROFILE_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userLocal.email }),
        })

      if (!res.ok) throw new Error("Gagal ambil data user dari n8n");
        const data = await res.json()
        if (data) {
          setFormData({
            phone_number: data.phone_number || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            tiktok: data.tiktok || "",
          })
        }
      } catch (error) {
        console.error("Gagal ambil profile:", error)
      }
    }

    if (userEmail) fetchProfile()
  }, [userEmail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_UPDATEPROFILE_URL}/update-social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Gagal update profil sosial")

      setAlertData({
        variant: "success",
        title: "Berhasil",
        message: "Social media berhasil diperbarui",
      })
      closeModal()
    } catch (error: any) {
      setAlertData({
        variant: "error",
        title: "Gagal",
        message: error.message,
      })
    }
  }

  const phoneNumber = formData.phone_number?.trim()

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Sosial Media
            </h4>

            {(phoneNumber || formData.instagram || formData.facebook || formData.tiktok) && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                {/* Instagram */}
                {formData.instagram && (
                  <a
                    href={`${formData.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-pink-500">
                      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1-.001 6.001A3 3 0 0 1 12 9zm4.5-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Instagram</span>
                  </a>
                )}

                {/* Facebook */}
                {formData.facebook && (
                  <a
                    href={`${formData.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-blue-600">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.004 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 17.004 22 12z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Facebook</span>
                  </a>
                )}

                {/* TikTok */}
                {formData.tiktok && (
                  <a
                    href={`${formData.tiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="currentColor"
  className="text-black dark:text-white"
>
  <path d="M12.5 2h3.1c.1.9.5 1.8 1.1 2.5.7.8 1.7 1.3 2.8 1.4v3.1c-1.7-.1-3.4-.7-4.8-1.8v8.2c0 1.8-.7 3.5-2 4.8-1.1 1.2-2.7 1.9-4.4 1.9A6.4 6.4 0 0 1 2 14.6a6.4 6.4 0 0 1 6.4-6.4c.6 0 1.2.1 1.8.3v3.3a3.3 3.3 0 1 0 2.3 3.2V2Z" />
</svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">TikTok</span>
                  </a>
                )}
              </div>
            )}
          </div>

         
        </div>
      </div>

      {/* Modal edit */}
      <Modal isOpen={isOpen} onClose={closeModal} title="Edit Social Media">
        <div className="flex flex-col gap-4 p-4">
          <Label htmlFor="phone_number">Nomor Telepon</Label>
          <Input name="phone_number" value={formData.phone_number} onChange={handleChange} />

          <Label htmlFor="instagram">Instagram</Label>
          <Input name="instagram" value={formData.instagram} onChange={handleChange} />

          <Label htmlFor="facebook">Facebook</Label>
          <Input name="facebook" value={formData.facebook} onChange={handleChange} />

          <Label htmlFor="tiktok">TikTok</Label>
          <Input name="tiktok" value={formData.tiktok} onChange={handleChange} />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
