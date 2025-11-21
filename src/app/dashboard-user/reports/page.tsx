"use client";

import { useEffect, useState, FormEvent } from "react";
import DatePicker from "@/components/form/date-picker";
import { exportToExcel } from "@/utils/exportExcel";

const N8N_BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL || "https://n8n.srv1074739.hstgr.cloud";
const N8N_GETREPORTS_URL = process.env.NEXT_PUBLIC_N8N_GETREPORTS_URL || `${N8N_BASE}/webhook/get-reports`;
const N8N_GETGROUPS_URL = process.env.NEXT_PUBLIC_N8N_GETGROUPS_URL || `${N8N_BASE}/webhook/get-groups`;
const N8N_ADDREPORTS_URL = process.env.NEXT_PUBLIC_N8N_ADDREPORTS_URL || `${N8N_BASE}/webhook/add-report`;
const N8N_EXPORT_URL = process.env.NEXT_PUBLIC_N8N_EXPORT_URL || `${N8N_BASE}/webhook/export`;
const N8N_EDIT_URL = process.env.NEXT_PUBLIC_N8N_EDIT_URL || `${N8N_BASE}/webhook/edit`;
const N8N_ADDGROUP_URL = process.env.NEXT_PUBLIC_N8N_ADDGROUP_URL || `${N8N_BASE}/webhook/addgroup`;

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
}

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [tempDateFrom, setTempDateFrom] = useState<string>("");
  const [tempDateTo, setTempDateTo] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [creategroups, setcreategroups] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  const [modalDate, setModalDate] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");
  const [modalCategory, setModalCategory] = useState<string>("");
  const [modalMerchant, setModalMerchant] = useState<string>("");
  const [modalItem, setModalItem] = useState<string>("");
  const [modalAmount, setModalAmount] = useState<number | "">("");

  const [modalgroupType, setmodalgroupType] = useState<string>("");
  const [modalgroupName, setmodalgroupName] = useState<string>("");
  const [ModalChannel, setModalChannel] = useState<string>("");

  const uniqueGroups = Array.from(new Map(groups.map((g) => [g.group_name, g])).values());

  // --- Fetch Groups ---
  const fetchGroups = async () => {
    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;
      if (!userEmail) return;

      const res = await fetch(N8N_GETGROUPS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // --- Fetch Reports ---
  const fetchReports = async (filters: any = {}) => {
  try {
    const userEmail = localStorage.getItem("user_email") || JSON.parse(localStorage.getItem("user") || "{}")?.email;
    if (!userEmail) return;

    const payload = {
  email: userEmail,
  group: filters.group ?? "",
  date_from: filters.from ?? null,
  date_to: filters.to ?? null,
  skipDateFilter: !filters.from && !filters.to,
};


    const res = await fetch(N8N_GETREPORTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Tangani response kosong
    const text = await res.text();
    if (!text) {
      setReports([]);
      return;
    }

    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      setReports(
        data.map((r: any) => ({
          id: r.id,
          date: r.flow_date || r.flow_transaction_date || "",
          type: r.flow_type,
          category: r.flow_category || "-",
          merchant: r.flow_merchant,
          item: r.flow_items,
          amount: Number(r.flow_amount) || 0,
        }))
      );
    } else {
      setReports([]);
    }
  } catch (err) {
    console.error(err);
    setReports([]);
  }
};

  useEffect(() => {
    fetchGroups();
    fetchReports();
  }, []);

  useEffect(() => {
  fetchReports({ group: selectedGroup, from: dateFrom, to: dateTo });
}, [selectedGroup, dateFrom, dateTo]);


  const handleApplyDates = () => {
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
  };

  const handleFetchExport = async () => {
  try {
    const userEmail =
      localStorage.getItem("user_email") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.email;
    if (!userEmail) return;

    setLoading(true);

    const payload = {
  email: userEmail, // BUKAN userEmail
  group: selectedGroup,
  date_from: dateFrom,
  date_to: dateTo,
};


    const res = await fetch(N8N_EXPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Gagal memuat data.");

    const result = await res.json();

    // Pastikan state terupdate
    setReports(result.data || []);

    // 🔥 Langsung download file Excel
    exportToExcel(result.data || [], {
      fileName: result.fileName || `export_${Date.now()}.xlsx`,
      sheetName: result.sheetName || "Sheet1",
    });

  } catch (err) {
    console.error(err);
    alert("Export gagal memuat data");
  } finally {
    setLoading(false);
  }
};
const safeDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString();
};
const safeAmount = (val: any) => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};


  const handleDownloadExcel = () => {
    if (!reports.length) return alert("Tidak ada data untuk diexport");

    const { fileName, sheetName } = (window as any).exportFileInfo || {};
    exportToExcel(reports, { fileName, sheetName });
  };

  const submitModal = async (e: FormEvent) => {
    e.preventDefault();
    if (!modalDate || !modalType || !modalCategory) return alert("Please fill all fields");

    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;
      if (!userEmail) return alert("Email pengguna tidak ditemukan.");

      const payload = {
        date: modalDate,
        type: modalType,
        category: modalCategory,
        merchant: modalMerchant,
        item: modalItem,
        amount: modalAmount,
        email: userEmail,
      };

      const res = await fetch(N8N_ADDREPORTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Data saved successfully");
        setShowAddModal(false);
        setModalDate(""); setModalType(""); setModalCategory(""); setModalMerchant("");
        setModalItem(""); setModalAmount("");
        fetchReports();
      } else {
        console.error(await res.text());
        alert("Failed to save data");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save data (network)");
    }
  };

  const submitAddGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;
      if (!userEmail) return alert("Email pengguna tidak ditemukan.");

      const payload = {
        date: modalDate,
        group_type: modalgroupType,
        group_name: modalgroupName,
        channel: ModalChannel,
        email: userEmail,
      };

      const res = await fetch(N8N_ADDGROUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error(await res.text());
        return alert("Failed to save group");
      }

      alert("Group saved successfully");
      setcreategroups(false);
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (report: Report) => {
    setEditingReport(report);
    setShowEditModal(true);
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <select
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">All Groups</option>
            {uniqueGroups.map((g) => (
              <option key={g.group_name} value={g.group_name}>
                {g.group_name}
              </option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <DatePicker
              id="dateFrom"
              placeholder="Start Date"
              defaultDate={parseYMDToDate(tempDateFrom)}
              onChange={(dates: any[]) => {
                const d = dates?.[0];
                if (d) setTempDateFrom(formatDateLocal(d));
              }}
            />

            <DatePicker
              id="dateTo"
              placeholder="End Date"
              defaultDate={parseYMDToDate(tempDateTo)}
              onChange={(dates: any[]) => {
                const d = dates?.[0];
                if (d) setTempDateTo(formatDateLocal(d));
              }}
            />

            <button onClick={handleApplyDates} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Apply
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add New Report
          </button>
<button
            onClick={() => setcreategroups(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add New Group
          </button>
          <button
            onClick={handleFetchExport}
            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto"
          >
            Export
          </button>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[600px] w-full text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Merchant</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  {reports.length > 0 ? (
    reports.map((row, idx) => (
      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
        <td className="px-4 py-3">{new Date(row.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</td>
        <td className="px-4 py-3">{row.type}</td>
        <td className="px-4 py-3">{row.category}</td>
        <td className="px-4 py-3">{row.merchant}</td>
        <td className="px-4 py-3">{row.item}</td>
        <td className={`px-4 py-3 font-medium ${row.amount > 0 ? "text-green-600" : "text-red-600"}`}>
          {row.amount > 0 ? `+${row.amount.toFixed(2)}` : `-${Math.abs(row.amount).toFixed(2)}`}
        </td>
        <td className="px-4 py-3">
          <button onClick={() => openEditModal(row)} className="px-4 py-1 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition">
            Edit
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={7} className="text-center py-4 text-gray-500">
        No data
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>

      {/* MODAL ADD REPORT (pakai state + DatePicker) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Report</h2>

            <form className="flex flex-col gap-4" onSubmit={submitModal}>
              <DatePicker
                id="modal_flow_date"
                placeholder="Flow Date"
                defaultDate={parseYMDToDate(modalDate)}
                onChange={(dates: any[]) => {
                  const d = dates?.[0];
                  if (d) setModalDate(formatDateLocal(d));
                }}
              />

              <select value={modalType} onChange={(e) => setModalType(e.target.value)} className="border rounded-lg px-3 py-2">
                <option value="">Select Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <input value={modalCategory} onChange={(e) => setModalCategory(e.target.value)} type="text" className="border rounded-lg px-3 py-2" placeholder="Category" />
              <input value={modalMerchant} onChange={(e) => setModalMerchant(e.target.value)} type="text" className="border rounded-lg px-3 py-2" placeholder="Merchant" />
              <input value={modalItem} onChange={(e) => setModalItem(e.target.value)} type="text" className="border rounded-lg px-3 py-2" placeholder="Item" />
              <input value={modalAmount} onChange={(e) => setModalAmount(e.target.value ? Number(e.target.value) : "")} type="number" className="border rounded-lg px-3 py-2" placeholder="Amount" />

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 border rounded-lg hover:bg-gray-100" onClick={() => setShowAddModal(false)}>
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{creategroups && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Groups</h2>

            <form className="flex flex-col gap-4" onSubmit={submitAddGroup}>
              <DatePicker
                id="modal_flow_date"
                placeholder="Flow Date"
                defaultDate={parseYMDToDate(modalDate)}
                onChange={(dates: any[]) => {
                  const d = dates?.[0];
                  if (d) setModalDate(formatDateLocal(d));
                }}
              />
              <input value={modalgroupName} onChange={(e) => setmodalgroupName(e.target.value)} type="text" className="border rounded-lg px-3 py-2" placeholder="Group Name" />
              
              <select value={modalgroupType} onChange={(e) => setmodalgroupType(e.target.value)} className="border rounded-lg px-3 py-2">
                <option value="">-Type-</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Bisnis">Bisnis</option>
              </select>
              <select value={ModalChannel} onChange={(e) => setModalChannel(e.target.value)} className="border rounded-lg px-3 py-2">
                <option value="">-Channel-</option>
                <option value="Telegram">Telegram</option>
              </select>
              
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 border rounded-lg hover:bg-gray-100" onClick={() => setcreategroups(false)}>
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       {showEditModal && editingReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
               <h2 className="text-xl font-semibold mb-4">Edit Report</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
              e.preventDefault();
              const userEmail =
              localStorage.getItem("user_email") ||
              JSON.parse(localStorage.getItem("user") || "{}")?.email;

          if (!userEmail) {
            alert("Email pengguna tidak ditemukan. Silakan login ulang.");
            return;
          }

          const payload = {
            id: editingReport.id, // pastikan n8n punya kolom ID unik
            date: editingReport.date,
            type: editingReport.type,
            category: editingReport.category,
            merchant: editingReport.merchant,
            item: editingReport.item,
            amount: editingReport.amount,
            email: userEmail,
          };

          const res = await fetch(N8N_EDIT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            alert("Data updated successfully");
            setShowEditModal(false);
            setEditingReport(null);
            fetchReports();
          } else {
            alert("Gagal memperbarui data");
          }
        }}
      >
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
          placeholder="Category"
        />

        <input
          type="text"
          value={editingReport.merchant}
          onChange={(e) =>
            setEditingReport({ ...editingReport, merchant: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
          placeholder="Merchant"
        />

        <input
          type="text"
          value={editingReport.item}
          onChange={(e) =>
            setEditingReport({ ...editingReport, item: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
          placeholder="Item"
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
          placeholder="Amount"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            onClick={() => setShowEditModal(false)}
          >
            Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};
