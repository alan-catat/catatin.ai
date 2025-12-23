"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Ambil data setting user dari n8n → GSheet
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_N8N_GETSETTINGS_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // jika perlu kirim email user agar filter sesuai user
          body: JSON.stringify({ email: process.env.NEXT_PUBLIC_USER_EMAIL }),
        });

        if (!res.ok) throw new Error("Gagal ambil data dari n8n");
        const data = await res.json();

        // pastikan formatnya jadi object
        const obj: Record<string, any> = {};
        if (Array.isArray(data)) {
          data.forEach((row) => {
            if (row.key) obj[row.key] = row.value;
          });
        } else if (typeof data === "object") {
          Object.assign(obj, data);
        }

        setSettings(obj);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Simpan setting user ke n8n → GSheet
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        email: process.env.NEXT_PUBLIC_USER_EMAIL, // opsional: bisa ganti sesuai user login
        settings: settings,
      };

      const res = await fetch(process.env.NEXT_PUBLIC_N8N_UPDATESETTINGS_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal simpan data ke n8n");

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        Settings
      </h1>

      {/* Language */}
      <div className="border rounded-xl p-4 space-y-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Language
        </h2>
        <select
          className="border rounded-lg px-3 py-2 w-full max-w-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          value={settings.language ?? "English"}
          onChange={(e) => handleChange("language", e.target.value)}
        >
          <option>English</option>
          <option>Bahasa Indonesia</option>
          <option>日本語</option>
        </select>
      </div>

      {/* Timezone */}
      <div className="border rounded-xl p-4 space-y-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Timezone
        </h2>
        <select
          className="border rounded-lg px-3 py-2 w-full max-w-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          value={settings.timezone ?? "GMT+7 (Jakarta)"}
          onChange={(e) => handleChange("timezone", e.target.value)}
        >
          <option>GMT+7 (Jakarta)</option>
          <option>GMT+9 (Tokyo)</option>
          <option>GMT+1 (Berlin)</option>
        </select>
      </div>

      {/* Notification */}
      <div className="border rounded-xl p-4 space-y-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Notification Preferences
        </h2>
        <div className="flex flex-col gap-2 text-gray-800 dark:text-white">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notify_email === "true"}
              onChange={(e) =>
                handleChange("notify_email", e.target.checked ? "true" : "false")
              }
              className="accent-blue-500"
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notify_push === "true"}
              onChange={(e) =>
                handleChange("notify_push", e.target.checked ? "true" : "false")
              }
              className="accent-blue-500"
            />
            Push Notifications
          </label>
        </div>
      </div>

      {/* Save button */}
      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
