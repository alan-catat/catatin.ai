"use client";

import { useEffect, useState } from "react";
import DatePicker from "@/components/form/date-picker"; // path sesuai
import { Modal } from "@/components/ui/modal";
import { exportToExcel } from "@/utils/exportExcel";

const N8N_BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL || "https://n8n.srv1074739.hstgr.cloud";
const N8N_GETREPORTS_URL = process.env.NEXT_PUBLIC_N8N_GETREPORTS_URL || `${N8N_BASE}/webhook/get-reports`;
const N8N_GETGROUPS_URL = process.env.NEXT_PUBLIC_N8N_GETGROUPS_URL || `${N8N_BASE}/webhook/get-groups`;
const N8N_ADDREPORTS_URL = process.env.NEXT_PUBLIC_N8N_ADDREPORTS_URL || `${N8N_BASE}/webhook/add-report`;

/** Helper: buat string YYYY-MM-DD dari Date (lokal) */
function formatDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Helper: parse "YYYY-MM-DD" jadi Date lokal (hindari new Date("YYYY-MM-DD") yang bisa jadi UTC) */
function parseYMDToDate(ymd?: string | null) {
  if (!ymd) return undefined;
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export default function ReportPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);

  // temporary picker states
  const [tempDateFrom, setTempDateFrom] = useState<string>("");
  const [tempDateTo, setTempDateTo] = useState<string>("");

  // modal form state (replace reading from DOM)
  const [modalDate, setModalDate] = useState<string>(""); // YYYY-MM-DD
  const [modalType, setModalType] = useState<string>("");
  const [modalCategory, setModalCategory] = useState<string>("");
  const [modalMerchant, setModalMerchant] = useState<string>("");
  const [modalItem, setModalItem] = useState<string>("");
  const [modalAmount, setModalAmount] = useState<number | "">("");

  // unique groups by name (frontend only)
  const uniqueGroups = Array.from(new Map(groups.map((g) => [g.group_name, g])).values());

  // --- fetch groups ---
  const fetchGroups = async () => {
    try {
      console.log("Fetching groups from:", N8N_GETGROUPS_URL);
      const res = await fetch(N8N_GETGROUPS_URL);
      const data = await res.json();
      console.log("groups raw:", data);
      if (Array.isArray(data)) setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // --- fetch reports (robust building of query params) ---
  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedGroup) params.append("group", selectedGroup);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const url = params.toString() ? `${N8N_GETREPORTS_URL}?${params.toString()}` : N8N_GETREPORTS_URL;
      console.log("Fetching reports from:", url);

      const res = await fetch(url);
      if (!res.ok) {
        console.error("Fetch reports status:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      console.log("reports raw:", data);

      if (Array.isArray(data)) {
        setReports(
          data.map((r) => ({
            // sesuaikan field dengan response n8n: gunakan flow_date atau flow_transaction_date sesuai output
            date: r.flow_date || r.flow_transaction_date || r.flow_transaction_date_formatted || "",
            type: r.flow_type,
            category: r.flow_category || r.category_name || "-",
            merchant: r.flow_merchant,
            item: r.flow_items,
            amount: Number(r.flow_amount) || 0,
          }))
        );
      } else {
        console.warn("Expected array from get-reports, got:", data);
        setReports([]);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // initial load
  useEffect(() => {
    fetchGroups();
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // call fetchReports when filters change — ensures apply works because we only call fetch after state set
  useEffect(() => {
    if (dateFrom || dateTo || selectedGroup) {
    fetchReports();
    }
  }, [selectedGroup, dateFrom, dateTo]);

  // Apply button: set states only
  const handleApplyDates = () => {
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
  };

  // Export unchanged
  const handleExport = () => {
    if (!reports.length) {
      alert("Tidak ada data untuk diexport");
      return;
    }
    const rows = reports.map((r) => ({
      Date: r.date,
      Type: r.type,
      Category: r.category,
      Merchant: r.merchant,
      Item: r.item,
      Amount: r.amount,
    }));
    exportToExcel(rows, { fileName: "reports.xlsx" });
  };

  // --- modal submit using state (uses DatePicker, not input[type="date"]) ---
  const submitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (!modalDate || !modalType || !modalCategory) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      flow_transaction_date: modalDate,
      flow_type: modalType,
      category: modalCategory,
      flow_merchant: modalMerchant,
      flow_items: modalItem,
      flow_amount: modalAmount || 0,
    };

    try {
      console.log("Posting add-report to:", N8N_ADDREPORTS_URL, payload);
      const res = await fetch(N8N_ADDREPORTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Data saved successfully");
        setShowAddModal(false);
        // clear modal fields
        setModalDate("");
        setModalType("");
        setModalCategory("");
        setModalMerchant("");
        setModalItem("");
        setModalAmount("");
        // refresh list
        fetchReports();
      } else {
        console.error("Add report failed:", res.status, await res.text());
        alert("Failed to save data");
      }
    } catch (err) {
      console.error("Error posting add-report:", err);
      alert("Failed to save data (network)");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* FILTER BAR */}
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
            onClick={handleExport}
            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto"
          >
            Export
          </button>
        </div>
      </div>

      {/* TABLE (tidak berubah) */}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">{row.merchant}</td>
                  <td className="px-4 py-3">{row.item}</td>
                  <td className={`px-4 py-3 font-medium ${row.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {row.amount > 0 ? `+${row.amount.toFixed(2)}` : `-${Math.abs(row.amount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
