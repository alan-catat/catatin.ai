"use client";

import { useState, useEffect } from "react";

const N8N_BASE = "https://n8n.srv1074739.hstgr.cloud";
const N8N_GET_SHEET_NAMES_URL = `${N8N_BASE}/webhook/get-sheet-names`;
const N8N_ADDGROUP_URL = `${N8N_BASE}/webhook/addgroup`;

interface SheetInfo {
  sheetId: number;
  name: string;
  index: number;
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddGroupModal({ isOpen, onClose, onSuccess }: AddGroupModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Input Sheet ID, Step 2: Pick Sheet
  
  // Step 1 states
  const [googleSheetId, setGoogleSheetId] = useState("");
  const [loadingSheets, setLoadingSheets] = useState(false);
  
  // Step 2 states
  const [availableSheets, setAvailableSheets] = useState<SheetInfo[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [groupType, setGroupType] = useState("");
  const [channel, setChannel] = useState("");
  const [modalDate, setModalDate] = useState("");
  
  const [submitting, setSubmitting] = useState(false);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setGoogleSheetId("");
      setAvailableSheets([]);
      setSelectedSheet("");
      setGroupType("");
      setChannel("");
      setModalDate("");
    }
  }, [isOpen]);

  const extractSheetIdFromUrl = (input: string): string => {
    // Handle full URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
    const urlMatch = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatch) return urlMatch[1];
    
    // Handle direct ID
    return input.trim();
  };

  const handleFetchSheets = async () => {
    const sheetId = extractSheetIdFromUrl(googleSheetId);
    
    if (!sheetId) {
      alert("Please enter a valid Google Sheet ID or URL");
      return;
    }

    setLoadingSheets(true);

    try {
      const res = await fetch(N8N_GET_SHEET_NAMES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch sheets: ${res.status}`);
      }

      const data = await res.json();
      console.log("Available sheets:", data);

      if (Array.isArray(data) && data.length > 0) {
        setAvailableSheets(data);
        setStep(2);
      } else {
        alert("No sheets found in this Google Sheet");
      }
    } catch (err) {
      console.error("Error fetching sheets:", err);
      alert("Failed to fetch sheets. Please check the Sheet ID and try again.");
    } finally {
      setLoadingSheets(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSheet || !groupType || !channel) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;

      if (!userEmail) {
        alert("Email not found. Please login again.");
        return;
      }

      const sheetId = extractSheetIdFromUrl(googleSheetId);

      const payload = {
        date: modalDate || new Date().toISOString().split("T")[0],
        group_type: groupType,
        group_name: selectedSheet, // Use selected sheet name as group name
        channel: channel,
        email: userEmail,
        sheet_id: sheetId, // Store the main sheet ID
      };

      console.log("Creating group with payload:", payload);

      const res = await fetch(N8N_ADDGROUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Add group failed:", errorText);
        throw new Error("Failed to create group");
      }

      alert("Group created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Add New Group {step === 2 && "- Select Sheet"}
        </h2>

        {step === 1 ? (
          /* STEP 1: Input Google Sheet ID/URL */
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Google Sheet URL or ID *
              </label>
              <input
                type="text"
                value={googleSheetId}
                onChange={(e) => setGoogleSheetId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the full Google Sheet URL or just the Sheet ID
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFetchSheets}
                disabled={loadingSheets || !googleSheetId}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loadingSheets ? "Loading..." : "Next"}
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Select Sheet & Additional Info */
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Sheet/Tab *
              </label>
              <select
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">-- Select a sheet --</option>
                {availableSheets.map((sheet) => (
                  <option key={sheet.sheetId} value={sheet.name}>
                    {sheet.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {availableSheets.length} sheet(s) found in this Google Sheet
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Group Type *
              </label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Personal">Personal</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Pribadi">Pribadi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Channel *
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">-- Select Channel --</option>
                <option value="Telegram">Telegram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={modalDate}
                onChange={(e) => setModalDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Selected Configuration:
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Group Name: <strong>{selectedSheet || "-"}</strong>
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Sheet ID: <strong>{extractSheetIdFromUrl(googleSheetId)}</strong>
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Group"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}