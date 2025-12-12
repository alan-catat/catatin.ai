"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import DatePicker from "@/components/form/date-picker";
import { exportToExcel } from "@/utils/exportExcel";
import * as React from "react";
import SearchableSelect from "./kategori";

const N8N_BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL || "https://n8n.srv1074739.hstgr.cloud";
const N8N_GETREPORTS_URL = `${N8N_BASE}/webhook/get-reports`;
const N8N_GETGROUPS_URL = `${N8N_BASE}/webhook/get-groups`;
const N8N_ADDREPORTS_URL = `${N8N_BASE}/webhook/add-reports`;
const N8N_EXPORT_URL = `${N8N_BASE}/webhook/export`;
const N8N_EDIT_URL = `${N8N_BASE}/webhook/edit`;
const N8N_ADDGROUP_URL = `${N8N_BASE}/webhook/addgroup`;

// --- Helper ---
function formatDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYMDToDate(ymd?: string | null) {
  if (!ymd) return undefined;
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

interface Report {
  id: string;
  date: string;
  type: string;
  category: string;
  merchant: string;
  item: string;
  amount: number;
  group_name?: string; // Tambahkan ini
}

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [appliedGroup, setAppliedGroup] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [tempDateFrom, setTempDateFrom] = useState<string>("");
  const [tempDateTo, setTempDateTo] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [creategroups, setcreategroups] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
const [exportLoading, setExportLoading] = useState(false); 
const [isActivated, setIsActivated] = useState(false);
const [activationCode, setActivationCode] = useState("");
const [loadingActivation, setLoadingActivation] = useState(false);
const [isLoading, setIsLoading] = useState(false);

  const [modalDate, setModalDate] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");
  const [modalCategory, setModalCategory] = useState<string>("");
  const [modalMerchant, setModalMerchant] = useState<string>("");
  const [modalItem, setModalItem] = useState<string>("");
  const [modalAmount, setModalAmount] = useState<number | "">("");
  const [modalQty, setModalQty] = useState<number| "">(1);
  const [modalUnit, setModalUnit] = useState<string>("pcs");
  const [modalgroupType, setmodalgroupType] = useState<string>("");
  const [modalgroupName, setmodalgroupName] = useState<string>("");
  const [ModalChannel, setModalChannel] = useState<string>("");
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");

  const uniqueGroups = React.useMemo(() => {
  console.log("Computing uniqueGroups from:", groups);

  if (!Array.isArray(groups) || groups.length === 0) {
    return [];
  }

  // Jika array berisi string langsung
  if (typeof groups[0] === "string") {
    return groups.map(name => ({ group_name: name }));
  }

  // Jika array berisi object
  return Array.from(
    new Map(
      groups.map((g) => {
        const groupName = g.group_name || g.name || g.groupName || "";
        return [groupName, { group_name: groupName }];
      })
    ).values()
  ).filter(g => g.group_name); // Remove empty names
}, [groups]);

  // Debug: Log groups
  useEffect(() => {
    console.log("Groups loaded:", groups.length);
    console.log("Unique groups:", uniqueGroups.length);
    console.log("Groups data:", groups);
  }, [groups]);

  // --- Fetch Groups ---
  const fetchGroups = async () => {
  try {
    const userEmail =
      localStorage.getItem("user_email") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.email;
    
    if (!userEmail) {
      console.log("No user email found");
      return;
    }

    console.log("=== FETCHING GROUPS ===");
    console.log("userEmail:", userEmail);

    const res = await fetch(N8N_GETGROUPS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    if (!res.ok) {
      console.error(`Fetch groups failed with status ${res.status}`);
      return;
    }

    const data = await res.json();
    
    // === DEBUG LOG ===
    console.log("=== GROUPS DATA RECEIVED ===");
    console.log("Type:", typeof data);
    console.log("Is Array:", Array.isArray(data));
    console.log("Length:", data?.length);
    console.log("Raw data:", data);
    
    if (Array.isArray(data) && data.length > 0) {
      console.log("=== FIRST GROUP SAMPLE ===");
      console.log("Keys:", Object.keys(data[0]));
      console.log("Values:", data[0]);
      
      // Cek apakah ada field group_name
      console.log("Has group_name?", "group_name" in data[0]);
      console.log("group_name value:", data[0].group_name);
    }
    
    if (Array.isArray(data)) {
      setGroups(data);
    }
  } catch (err) {
    console.error("Error fetching groups:", err);
  }
};

  // --- Fetch Reports ---
const fetchReports = async (filters: any = {}) => {
  try {
    const userEmail =
      localStorage.getItem("user_email") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.email;

    if (!userEmail) {
      console.log("User email not ready yet");
      return;
    }

    setLoading(true);

    console.log("=== FETCH REPORTS CALLED ===");
    console.log("filters:", filters);

    // PAYLOAD untuk master sheet
    // N8N akan handle filtering by group_name
    const payload = {
      email: userEmail,
      groupName: filters.group || "", // Kirim empty string untuk "All Groups"
      date_from: filters.from || "",
      date_to: filters.to || "",
    };

    console.log("Payload:", payload);

    const res = await fetch(N8N_GETREPORTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`HTTP error: ${res.status}`);
      setReports([]);
      setLoading(false);
      return;
    }

    const text = await res.text();

    if (!text || text.trim() === "") {
      console.log("Empty response from N8N");
      setReports([]);
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(text);
      console.log("✓ Received data:", data.length, "reports");

      if (Array.isArray(data)) {
        const mappedReports = data.map((r: any) => ({
          id: r.id || "",
          date: r.transaction_date || "",
          type: r.type || "",
          category: r.category || "-",
          merchant: r.merchant || "",
          item: r.items || "",
          amount: Number(r.amount) || 0,
          group_name: r.group_name || "", // Ambil dari kolom group_name
        }));

        console.log("=== MAPPED REPORTS ===");
        console.log("Total:", mappedReports.length);
        
        // Optional: Filter by group di frontend (jika N8N belum filter)
        const filteredReports = filters.group
          ? mappedReports.filter(r => r.group_name === filters.group)
          : mappedReports;

        console.log("After filter:", filteredReports.length);
        setReports(filteredReports);
      } else {
        console.log("Data is not an array");
        setReports([]);
      }
    } catch (parseErr) {
      console.error("Failed to parse response:", parseErr);
      console.error("Response text:", text);
      setReports([]);
    }

    setLoading(false);

  } catch (err) {
    console.error("Fatal error:", err);
    setReports([]);
    setLoading(false);
  }
};
  
const [userEmail, setUserEmail] = useState<string | null>(null);
const [initialLoadDone, setInitialLoadDone] = useState(false);

useEffect(() => {
  const email =
    localStorage.getItem("user_email") ||
    JSON.parse(localStorage.getItem("user") || "{}")?.email;

  setUserEmail(email);
}, []);

  useEffect(() => {
  if (userEmail) {
    setTimeout(fetchGroups, 200);
  }
}, [userEmail]);

useEffect(() => {
  if (userEmail && groups.length > 0 && !initialLoadDone) {
    console.log("Initial fetch reports");
    const initialFilters = { group: selectedGroup, from: dateFrom, to: dateTo };
    setAppliedFilters(initialFilters); // Set applied filters
    fetchReports(initialFilters);
    setInitialLoadDone(true);
  }
}, [userEmail, groups]);

const [appliedFilters, setAppliedFilters] = useState({
  group: "",
  from: "",
  to: "",
});

  const handleApplyDates = () => {
  setDateFrom(tempDateFrom);
  setDateTo(tempDateTo);
  
  // Simpan filter yang di-apply
  const newFilters = {
    group: selectedGroup,
    from: tempDateFrom,
    to: tempDateTo,
  };
  setAppliedFilters(newFilters);
  
  fetchReports(newFilters);
};

const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newGroup = e.target.value;
  setSelectedGroup(newGroup);

  const groupDetail = groups.find(g => 
    (g.group_name || g.name || g.groupName) === newGroup
  );

  let type = "";
  if (groupDetail?.group_type) {
    // Ambil huruf pertama dan ubah menjadi kapital
    type = groupDetail.group_type.charAt(0).toUpperCase() + groupDetail.group_type.slice(1).toLowerCase();
  }
  
  setSelectedGroupType(type); // <-- Set state
};

  const handleFetchExport = async () => {
  if (reports.length === 0) {
    showToast("Tidak ada data untuk diexport", "error");
    return;
  }

  try {
    setExportLoading(true);

    const userEmail =
      localStorage.getItem("user_email") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.email;
    
    if (!userEmail) {
      showToast("Email tidak ditemukan. Silakan login ulang.", "error");
      setExportLoading(false);
      return;
    }

    // GUNAKAN appliedFilters yang sudah di-apply, BUKAN selectedGroup
    const payload = {
      email: userEmail,
      groupName: appliedFilters.group || "",
      date_from: appliedFilters.from || "",
      date_to: appliedFilters.to || "",
    };

    console.log("Export payload:", payload);

    const res = await fetch(N8N_GETREPORTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Export failed with status ${res.status}`);
    }

    const result = await res.json();
    console.log("Export result:", result);

    if (Array.isArray(result) && result.length > 0) {
      const exportData = result.map((r: any, index: number) => ({
        no: index + 1,
        group_name: r.group_name || "",
        channel: r.channel || "",
        transaction_date: r.transaction_date || "",
        type: r.type || "",
        category: r.category || "",
        items: r.items || "",
        qty: r.qty || 1,
        unit: r.unit || "pcs",
        merchant: r.merchant || "",
        amount: Number(r.amount) || 0,
        text_chat: r.text_chat || "",
        file_url: r.file_url || "",
        created_date: r.created_date || "",
      }));

      // Filter menggunakan appliedFilters
      const filteredData = appliedFilters.group
        ? exportData.filter(r => r.group_name === appliedFilters.group)
        : exportData;

      console.log("Filtered export data:", filteredData.length);

      exportToExcel(filteredData, {
        fileName: `export_${appliedFilters.group || 'all'}_${Date.now()}.xlsx`,
        sheetName: appliedFilters.group || "All Data",
      });

      showToast("Export berhasil!", "success");
    } else {
      showToast("Tidak ada data untuk diexport", "error");
    }
  } catch (err) {
    console.error("Export error:", err);
    showToast("Export gagal: " + (err as Error).message, "error");
  } finally {
    setExportLoading(false);
  }
};

  const submitModal = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!modalDate || !modalType || !modalCategory) {
      showToast("Mohon isi semua field yang wajib");
      return;
    }

    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;
      
      if (!userEmail) {
        showToast("Email tidak ditemukan. Silakan login ulang.");
        return;
      }

      // Payload sesuai dengan add-reports workflow
      const payload = {
        date: modalDate,
        type: modalType,
        category: modalCategory,
        merchant: modalMerchant,
        item: modalItem,
        amount: modalAmount,
        email: userEmail,
        qty: modalQty,
        unit: modalUnit, 
        group_name: selectedGroup,
      };

      console.log("Add report payload:", payload);

      const res = await fetch(N8N_ADDREPORTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Data berhasil disimpan!");
        setShowAddModal(false);
        
        // Reset form
        setModalDate("");
        setModalType("");
        setModalCategory("");
        setModalMerchant("");
        setModalItem("");
        setModalAmount("");
        setModalQty("");
        setModalUnit("");

        // Refresh data
        fetchReports({ group: selectedGroup, from: dateFrom, to: dateTo });
      } else {
        const errorText = await res.text();
      console.error("❌ Add report failed:", errorText);
      showToast(`Gagal menyimpan data: ${res.status} - ${errorText}`, "error");
    }
  } catch (err) {
    console.error("❌ Fatal error:", err);
    showToast("Gagal menyimpan data: " + (err as Error).message, "error");
  }
};

const checkAndGenerateActivation = async (email: string, channel: string) => {
  if (!email || !channel) {
    console.log("Email atau channel kosong");
    return;
  }
  
  if (!modalgroupType) {
    showToast("Pilih tipe grup terlebih dahulu", "error");
    return;
  }
  
  if (channel === "telegram" && !modalgroupName) {
    showToast("Nama grup wajib diisi untuk Telegram", "error");
    return;
  }
  
  setLoadingActivation(true);
  
  try {
    const payload = {
      action: "check_activation",
      email: email,
      channel: channel.toLowerCase(),
      group_type: modalgroupType,
      group_name: channel === "telegram" ? modalgroupName : "",
    };
    
    console.log("=== GENERATE KODE AKTIVASI ===");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    
    const res = await fetch(N8N_ADDGROUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Request failed:", errorText);
      showToast("Gagal proses aktivasi: " + errorText, "error");
      return;
    }

    const responseText = await res.text();
    console.log("Raw response:", responseText);
    
    if (!responseText || responseText.trim() === "") {
      showToast("Webhook mengembalikan response kosong", "error");
      return;
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("Parsed data:", data);
    } catch (parseErr) {
      console.error("Parse error:", parseErr);
      showToast("Response bukan format JSON yang valid", "error");
      return;
    }
    
    // ✅ Handle Error Response
    if (data?.error || data?.status === "error") {
      const errorMsg = data.error || data.message || "Terjadi kesalahan";
      console.warn("Error from webhook:", errorMsg);
      showToast(errorMsg, "error");
      setIsActivated(false);
      setActivationCode("");
      return;
    }
    
    // ✅ Handle Success Response - Array
    if (Array.isArray(data) && data.length > 0) {
      const record = data[0];
      
      console.log("Record:", record);
      console.log("aktivasi-code:", record["aktivasi-code"]);
      
      const activationCode = record["aktivasi-code"];
      
      // ✅ Validasi kode aktivasi ada
      if (!activationCode) {
        showToast("⚠️ Kode aktivasi tidak ditemukan dalam response", "error");
        return;
      }
      
      setActivationCode(activationCode);
      
      // Cek apakah sudah aktivasi (opsional, tergantung response)
      const status = record.status || "";
      const chatId = record.chat_id || "";
      const isActive = status.toLowerCase() === "active" || 
                       status.toLowerCase() === "activated" || 
                       !!chatId;
      
      setIsActivated(isActive);
      
      if (isActive) {
        showToast(`✅ ${channel} sudah teraktivasi sebelumnya!`, "success");
      } else {
        showToast(`✅ Kode aktivasi berhasil dibuat: ${activationCode}`, "success");
      }
      
      return; // ✅ PENTING: Return setelah berhasil
    }
    
    // ✅ Fallback jika format tidak sesuai
    console.warn("Unexpected response format:", data);
    showToast("Format response tidak sesuai", "error");
    
  } catch (err) {
    console.error("Fatal error:", err);
    showToast("Error: " + (err as Error).message, "error");
  } finally {
    setLoadingActivation(false);
  }
};

const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedChannel = e.target.value;
  setModalChannel(selectedChannel);
  
  // Reset nama grup untuk Whatsapp
  if (selectedChannel === "whatsapp") {
    setmodalgroupName("");
  }
  
  // Reset activation state
  setIsActivated(false);
  setActivationCode("");
};

  const submitAddGroup = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const userEmail = localStorage.getItem("user_email") || 
    JSON.parse(localStorage.getItem("user") || "{}")?.email;

  if (!userEmail) {
    showToast("Email tidak ditemukan. Silakan login ulang.", "error");
    return;
  }

  if (!ModalChannel) {
    showToast("Channel wajib diisi.", "error");
    return;
  }

  if (!modalgroupType) {
    showToast("Tipe wajib diisi.", "error");
    return;
  }

  if (ModalChannel === "Telegram" && !modalgroupName) {
    showToast("Nama Grup wajib diisi untuk Telegram.", "error");
    return;
  }

  if (!activationCode) {
    showToast("Generate kode aktivasi terlebih dahulu.", "error");
    return;
  }

  // ❌ HAPUS VALIDASI INI - Karena aktivasi terjadi di bot, bukan di sini
  // if (ModalChannel === "Whatsapp" && !isActivated) {
  //   showToast("Silakan aktivasi Whatsapp terlebih dahulu.", "error");
  //   return;
  // }

  try {
    setIsLoading(true);

    const payload = {
      action: "add_group",
      group_type: modalgroupType,
      group_name: ModalChannel === "Whatsapp" ? "" : modalgroupName,
      channel: ModalChannel,
      email: userEmail,
      "aktivasi-code": activationCode,
    };
    
    console.log("=== ADD GROUP PAYLOAD ===");
    console.log(JSON.stringify(payload, null, 2));
    
    const response = await fetch(N8N_ADDGROUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      showToast("Group berhasil disimpan! Silakan kirim kode aktivasi ke bot.", "success");
      
      // ✅ Modal TETAP TERBUKA agar user bisa kirim kode
      // User harus klik "Tutup" manual setelah kirim kode
      
      setTimeout(fetchGroups, 1000);
      
    } else {
      const errorText = await response.text();
      console.error("Add group failed:", errorText);
      showToast(`Gagal: ${response.status} - ${errorText}`, "error");
    }

  } catch (err: any) {
    console.error("Add group error:", err);
    
    if (err.name === 'AbortError') {
      showToast("Request timeout", "error");
    } else if (err.message.includes('Failed to fetch')) {
      showToast("Tidak bisa koneksi ke webhook", "error");
    } else {
      showToast("Error: " + err.message, "error");
    }
    
  } finally {
    setIsLoading(false);
  }
};

  const openEditModal = (report: Report) => {
    setEditingReport(report);
    setShowEditModal(true);
  };

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!editingReport) return;

    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;

      if (!userEmail) {
        alert("Email tidak ditemukan. Silakan login ulang.");
        return;
      }

      // Payload sesuai dengan Edit-report workflow
      const payload = {
        id: editingReport.id,
        date: editingReport.date,
        type: editingReport.type,
        category: editingReport.category,
        merchant: editingReport.merchant,
        item: editingReport.item,
        amount: editingReport.amount,
        email: userEmail,
      };

      console.log("Edit payload:", payload);

      const res = await fetch(N8N_EDIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Data berhasil diupdate!");
        setShowEditModal(false);
        setEditingReport(null);
        
        // Refresh data
        fetchReports({ group: selectedGroup, from: dateFrom, to: dateTo });
      } else {
        const errorText = await res.text();
        console.error("Edit failed:", errorText);
        alert("Gagal update data: " + errorText);
      }
    } catch (err) {
      console.error("Edit error:", err);
      alert("Gagal update data: " + (err as Error).message);
    }
  };

  const [toast, setToast] = useState<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}>({ show: false, message: '', type: 'success' });

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  setToast({ show: true, message, type });
  setTimeout(() => {
    setToast({ show: false, message: '', type: 'success' });
  }, 3000); // Hilang setelah 3 detik
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <select
  className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
  value={selectedGroup}
  onChange={handleGroupChange}
>
  <option value="">Semua Grup</option>
  {uniqueGroups.map((g, index) => {
    const groupName = typeof g === "string" ? g : g.group_name;
    return (
      <option key={groupName || index} value={groupName}>
        {groupName}
      </option>
    );
  })}
</select>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <DatePicker
              id="dateFrom"
              placeholder="Tanggal Awal"
              defaultDate={parseYMDToDate(tempDateFrom)}
              onChange={(dates: any[]) => {
                const d = dates?.[0];
                if (d) setTempDateFrom(formatDateLocal(d));
              }}
            />

            <DatePicker
              id="dateTo"
              placeholder="Tanggal Akhir"
              defaultDate={parseYMDToDate(tempDateTo)}
              onChange={(dates: any[]) => {
                const d = dates?.[0];
                if (d) setTempDateTo(formatDateLocal(d));
              }}
            />

            <button 
              onClick={handleApplyDates} 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 w-full md:w-auto">
  <button
    onClick={() => setShowAddModal(true)}
    className="w-full sm:w-auto sm:flex-1 md:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap text-center"
  >
    Tambah Transaksi
  </button>
  <button
    onClick={() => setcreategroups(true)}
    className="w-full sm:w-auto sm:flex-1 md:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap text-center"
  >
    Tambah Channel
  </button>
  <button
    onClick={handleFetchExport}
    disabled={exportLoading}
    className="w-full sm:w-auto sm:flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 whitespace-nowrap"
  >
    {exportLoading ? "Proses..." : "Download"}
  </button>
</div>
</div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="overflow-x-auto w-full table-wrapper">
            <table className="min-w-[600px] w-full text-sm text-gray-800 dark:text-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Tipe</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Toko</th>
                  <th className="px-4 py-3 text-left">Barang</th>
                  <th className="px-4 py-3 text-left">Jumlah</th>
                  <th className="px-4 py-3 text-left">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reports.length > 0 ? (
                  reports.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3">
  {row.date
    ? (() => {
        const d = new Date(row.date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = String(d.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
      })()
    : "-"}
</td>
                      <td className="px-4 py-3">{row.type}</td>
                      <td className="px-4 py-3">{row.category}</td>
                      <td className="px-4 py-3">{row.merchant}</td>
                      <td className="px-4 py-3">{row.item}</td>
                      <td
  className={`px-4 py-3 font-medium ${
    row.amount >= 0 ? "text-green-600" : "text-red-600"
  }`}
>
  {Math.abs(row.amount).toLocaleString("id-ID")}
</td>

                      <td className="px-4 py-3">
                        <button 
                          onClick={() => openEditModal(row)} 
                          className="px-4 py-1 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      Tidak ada data tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL ADD REPORT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tambah transaksi baru</h2>

            <form className="flex flex-col gap-4" onSubmit={submitModal}>
              <DatePicker
                id="modal_flow_date"
                placeholder="Tanggal Transaksi"
                defaultDate={parseYMDToDate(modalDate)}
                onChange={(dates: any[]) => {
                  const d = dates?.[0];
                  if (d) setModalDate(formatDateLocal(d));
                }}
              />

              <select
  className="w-full border rounded-lg px-3 py-2 text-left flex items-center justify-between
                   bg-white dark:bg-neutral-800 dark:border-gray-600
                   hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
  value={selectedGroup}
  onChange={handleGroupChange}
>
  <option value="">Semua Grup</option>
  {uniqueGroups.map((g, index) => {
    const groupName = typeof g === "string" ? g : g.group_name;
    return (
      <option key={groupName || index} value={groupName}>
        {groupName}
      </option>
    );
  })}
</select>

              <select 
  value={modalType} 
  onChange={(e) => setModalType(e.target.value)} 
  className="w-full border rounded-lg px-3 py-2 text-left flex items-center justify-between
                   bg-white dark:bg-neutral-800 dark:border-gray-600
                   hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
  required
>
  <option value="">Pilih Tipe</option>
  <option value="income">Pemasukan</option>
  <option value="expense">Pengeluaran</option>
</select>

 <SearchableSelect
  value={modalCategory}
  onChange={setModalCategory}
  required
editable={true}
groupType={selectedGroupType}
/>


              <input 
                value={modalMerchant} 
                onChange={(e) => setModalMerchant(e.target.value)} 
                type="text" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Toko" 
              />
              <input 
                value={modalItem} 
                onChange={(e) => setModalItem(e.target.value)} 
                type="text" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Barang" 
              />
              <input 
                value={modalQty} 
                onChange={(e) => setModalQty(e.target.value ? Number(e.target.value) : "")} 
                type="number" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Jumlah item" 
              />
              <input 
                value={modalUnit} 
                onChange={(e) => setModalUnit(e.target.value)} 
                type="text" 
                className="border rounded-lg px-3 py-2" 
                placeholder="ex: Pcs" 
              />
              <input 
                value={modalAmount} 
                onChange={(e) => setModalAmount(e.target.value ? Number(e.target.value) : "")} 
                type="number" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Jumlah Uang" 
              />

              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100" 
                  onClick={() => setShowAddModal(false)}
                >
                  Tutup
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* MODAL ADD GROUP */}
{creategroups && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Tambah Channel</h2>

      <form className="flex flex-col gap-4" onSubmit={async (e) => {
        e.preventDefault();
        
        const userEmail = localStorage.getItem("user_email") || 
          JSON.parse(localStorage.getItem("user") || "{}")?.email;
        
        if (!userEmail) {
          showToast("Email tidak ditemukan. Silakan login ulang.", "error");
          return;
        }
        
        if (!ModalChannel) {
          showToast("Pilih channel terlebih dahulu", "error");
          return;
        }
        
        if (ModalChannel === "telegram" && !modalgroupName) {
          showToast("Nama grup wajib diisi untuk Telegram", "error");
          return;
        }
        
        if (!modalgroupType) {
          showToast("Pilih tipe grup terlebih dahulu", "error");
          return;
        }
        
        await checkAndGenerateActivation(userEmail, ModalChannel);
      }}>
        <select 
          value={ModalChannel} 
          onChange={handleChannelChange} 
          className="border rounded-lg px-3 py-2"
          required
        >
          <option value="">-Channel- *</option>
          <option value="telegram">Telegram</option>
          <option value="whatsapp">Whatsapp</option>
        </select>
        <input 
          value={modalgroupName} 
          onChange={(e) => setmodalgroupName(e.target.value)} 
          type="text" 
          className="border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" 
          placeholder="Nama Grup *" 
          required={ModalChannel !== "whatsapp"}
          disabled={ModalChannel === "whatsapp"}
        />
        
        <select 
          value={modalgroupType} 
          onChange={(e) => setmodalgroupType(e.target.value)} 
          className="border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required={ModalChannel !== "whatsapp"}
        >
          <option value="">-Tipe- *</option>
          <option value="Personal">Personal</option>
          <option value="Bisnis">Bisnis</option>
        </select>
        
        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="button" 
            className="px-4 py-2 border rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setcreategroups(false);
              // Reset form
              setModalChannel("");
              setmodalgroupName("");
              setmodalgroupType("");
              setActivationCode("");
              setIsActivated(false);
            }}
          >
            Tutup
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loadingActivation}
          >
            {loadingActivation ? "Generating..." : "Aktivasi"}
          </button>
        </div>

        {/* Pop-up Aktivasi - SELALU TAMPIL */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {!isActivated ? (
            <div className="text-sm">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Kode Aktivasi:
              </p>
              <div className="relative">
                <code className="block bg-white dark:bg-gray-900 p-3 pr-12 rounded border border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-mono">
                  /aktivasi {activationCode || ""}
                </code>
                {/* Button Copy - Muncul jika ada kode */}
                {activationCode && (
                  <button
                    type="button"
                    onClick={() => {
                      const textToCopy = `/aktivasi ${activationCode}`;
                      navigator.clipboard.writeText(textToCopy).then(() => {
                        showToast("✅ Kode berhasil disalin!", "success");
                      }).catch(() => {
                        showToast("❌ Gagal menyalin kode", "error");
                      });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Copy kode"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Kirim kode ini untuk mengaktifkan channel
              </p>
              
              {/* Button Kirim - Hanya muncul jika ada kode */}
              {activationCode && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      const message = encodeURIComponent(`/aktivasi ${activationCode}`);
                      if (ModalChannel === "telegram") {
                        window.open(`https://t.me/share/url?text=${message}`, '_blank');
                      } else if (ModalChannel === "whatsapp") {
                        window.open(`https://wa.me/?text=${message}`, '_blank');
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                      ModalChannel === "telegram" 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={!ModalChannel}
                  >
                    {ModalChannel === "telegram" ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                        </svg>
                        Kirim ke Telegram
                      </>
                    ) : ModalChannel === "whatsapp" ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Kirim ke WhatsApp
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        Pilih Channel Terlebih Dahulu
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Anda sudah aktivasi</span>
            </div>
          )}
        </div>
      </form>
    </div>
  </div>
)}

      {/* MODAL EDIT REPORT */}
      {showEditModal && editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Laporan</h2>
            
            <form className="flex flex-col gap-4" onSubmit={submitEdit}>
              <input
                type="text"
                value={editingReport.id || ""}
                readOnly
                className="border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                placeholder="ID"
              />
              
              <input
                type="text"
                value={editingReport.category}
                onChange={(e) =>
                  setEditingReport({ ...editingReport, category: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
                placeholder="Kategori"
              />

              <input
                type="text"
                value={editingReport.merchant}
                onChange={(e) =>
                  setEditingReport({ ...editingReport, merchant: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
                placeholder="Toko"
              />

              <input
                type="text"
                value={editingReport.item}
                onChange={(e) =>
                  setEditingReport({ ...editingReport, item: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
                placeholder="Barang"
              />

              <input
                type="number"
                value={editingReport.amount}
                onChange={(e) =>
                  setEditingReport({
                    ...editingReport,
                    amount: Number(e.target.value),
                  })
                }
                className="border rounded-lg px-3 py-2"
                placeholder="Jumlah Uang"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  onClick={() => setShowEditModal(false)}
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toast Notification */}
{toast.show && (
  <div
    className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
      toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } ${
      toast.type === 'success'
        ? 'bg-green-500 text-white'
        : toast.type === 'error'
        ? 'bg-red-500 text-white'
        : 'bg-blue-500 text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      {toast.type === 'success' && (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {toast.type === 'error' && (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      <span className="font-medium">{toast.message}</span>
    </div>
  </div>
)}
    </div>
  );
}