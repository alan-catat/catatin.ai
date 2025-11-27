"use client";

import { useEffect, useState, FormEvent } from "react";
import DatePicker from "@/components/form/date-picker";
import { exportToExcel } from "@/utils/exportExcel";

const N8N_BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL || "https://n8n.srv1074739.hstgr.cloud";
const N8N_GETREPORTS_URL = `${N8N_BASE}/webhook/get-reports`;
const N8N_GETGROUPS_URL = `${N8N_BASE}/webhook/get-groups`;
const N8N_ADDREPORTS_URL = `${N8N_BASE}/webhook/add-reports`; // Fixed: sesuai workflow
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

      console.log("Fetching groups for:", userEmail);

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
      console.log("Groups data:", data);
      
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
       if (!userEmail) {
      console.log("User email not ready yet");
      return;
    }


      setLoading(true);

      // Jika ada filter group, kita ambil data dari group tersebut
      if (filters.group) {
        // Cari group data dari state groups
        const groupData = groups.find(g => g.group_name === filters.group);
        
        if (!groupData) {
          console.error("Group not found:", filters.group);
          setReports([]);
          setLoading(false);
          return;
        }

        console.log("Fetching reports for group:", groupData);

        // Fetch langsung dari individual sheet
        const sheetId = groupData["Link Individual gsheet"];
        const payload = {
          email: userEmail,
          sheetId: sheetId,
          groupName: filters.group,
          date_from: filters.from || "",
          date_to: filters.to || "",
        };

        console.log("Fetching group reports with payload:", payload);

        const res = await fetch(N8N_GETREPORTS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        
        if (!text || text.trim() === "") {
          setReports([]);
          setLoading(false);
          return;
        }

        
        try {
          const data = JSON.parse(text);
          console.log("Group reports data:", data);

          if (Array.isArray(data)) {
            const mappedReports = data.map((r: any) => ({
              id: r.id || "",
              date: r.flow_date || "",
              type: r.flow_type || "",
              category: r.flow_category || "-",
              merchant: r.flow_merchant || "",
              item: r.flow_items || "",
              amount: Number(r.flow_amount) || 0,
              group_name: filters.group,
            }));

            console.log("Mapped group reports:", mappedReports);
            setReports(mappedReports);
          } else {
            setReports([]);
          }
        } catch (parseErr) {
          console.error("Failed to parse group reports:", parseErr);
          setReports([]);
        }
      } else {
        // Fetch all reports dari semua groups
        console.log("Fetching all reports from all groups");

        const allReports: Report[] = [];
        const uniqueGroups = Array.from(
          new Map(groups.map(g => [g.group_name, g])).values()
        );

        console.log("Unique groups to fetch:", uniqueGroups.length);

        for (const group of uniqueGroups) {
          try {
            const sheetId = group["Link Individual gsheet"];
            
            if (!sheetId) {
              console.warn(`No sheet ID for group: ${group.group_name}`);
              continue;
            }

            const payload = {
              email: userEmail,
              sheetId: sheetId,
              groupName: group.group_name,
              date_from: filters.from || "",
              date_to: filters.to || "",
            };

            console.log(`Fetching group: ${group.group_name}`);

            const res = await fetch(N8N_GETREPORTS_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const text = await res.text();
            
            if (!text || text.trim() === "") {
              console.log(`Empty response for group: ${group.group_name}`);
              continue;
            }

            const data = JSON.parse(text);
            console.log(`Data from ${group.group_name}:`, data.length, "items");

            if (Array.isArray(data)) {
              const mappedReports = data.map((r: any) => ({
                id: r.id || "",
                date: r.flow_date || "",
                type: r.flow_type || "",
                category: r.flow_category || "-",
                merchant: r.flow_merchant || "",
                item: r.flow_items || "",
                amount: Number(r.flow_amount) || 0,
                group_name: group.group_name,
              }));

              allReports.push(...mappedReports);
            }
          } catch (err) {
            console.error(`Error fetching reports for group ${group.group_name}:`, err);
          }
        }

        console.log("Total reports from all groups:", allReports.length);
        
        // Remove duplicates berdasarkan ID (jika ada duplikasi)
        const uniqueReports = Array.from(
          new Map(allReports.map(r => [r.id + r.group_name, r])).values()
        );
        
        console.log("After removing duplicates:", uniqueReports.length);
        setReports(uniqueReports);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
      setLoading(false);
    }
  };
  
const [userEmail, setUserEmail] = useState<string | null>(null);

useEffect(() => {
  const email =
    localStorage.getItem("user_email") ||
    JSON.parse(localStorage.getItem("user") || "{}")?.email;

  setUserEmail(email);
}, []);
  useEffect(() => {
  setTimeout(fetchGroups, 200); // 200ms
}, []);

  useEffect(() => {
  fetchReports({ group: selectedGroup, from: dateFrom, to: dateTo });
}, [groups, selectedGroup, dateFrom, dateTo]);

  const handleApplyDates = () => {
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
  };

  const handleFetchExport = async () => {
    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;
      
      if (!userEmail) {
        alert("Email tidak ditemukan. Silakan login ulang.");
        return;
      }

      setLoading(true);

      // Payload sesuai dengan Export workflow
      const payload: any = {
        userEmail,
        group: selectedGroup || "", // Kirim empty string jika tidak ada
        date_from: dateFrom || "",
        date_to: dateTo || "",
      };

      console.log("Export payload:", payload);

      const res = await fetch(N8N_EXPORT_URL, {
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
        // Download Excel
        exportToExcel(result, {
          fileName: `export_${selectedGroup || 'all'}_${Date.now()}.xlsx`,
          sheetName: selectedGroup || "All Data",
        });

        alert("Export berhasil!");
      } else {
        alert("Tidak ada data untuk diexport");
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("Export gagal: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const submitModal = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!modalDate || !modalType || !modalCategory) {
      alert("Mohon isi semua field yang wajib");
      return;
    }

    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;
      
      if (!userEmail) {
        alert("Email tidak ditemukan. Silakan login ulang.");
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
      };

      console.log("Add report payload:", payload);

      const res = await fetch(N8N_ADDREPORTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Data berhasil disimpan!");
        setShowAddModal(false);
        
        // Reset form
        setModalDate("");
        setModalType("");
        setModalCategory("");
        setModalMerchant("");
        setModalItem("");
        setModalAmount("");
        
        // Refresh data
        fetchReports({ group: selectedGroup, from: dateFrom, to: dateTo });
      } else {
        const errorText = await res.text();
        console.error("Add report failed:", errorText);
        alert("Gagal menyimpan data: " + errorText);
      }
    } catch (err) {
      console.error("Add report error:", err);
      alert("Gagal menyimpan data: " + (err as Error).message);
    }
  };

  const submitAddGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const userEmail =
        localStorage.getItem("user_email") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email;
      
      if (!userEmail) {
        alert("Email tidak ditemukan. Silakan login ulang.");
        return;
      }

      const payload = {
        date: modalDate,
        group_type: modalgroupType,
        group_name: modalgroupName,
        channel: ModalChannel,
        email: userEmail,
      };

      console.log("Add group payload:", payload);

      const res = await fetch(N8N_ADDGROUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Add group failed:", errorText);
        alert("Gagal menyimpan group: " + errorText);
        return;
      }

      alert("Group berhasil disimpan!");
      setcreategroups(false);
      
      // Reset form
      setModalDate("");
      setmodalgroupType("");
      setmodalgroupName("");
      setModalChannel("");
      
      // Refresh groups
      fetchGroups();
    } catch (err) {
      console.error("Add group error:", err);
      alert("Gagal menyimpan group: " + (err as Error).message);
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

            <button 
              onClick={handleApplyDates} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
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
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto disabled:opacity-50"
          >
            {loading ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
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
                      <td className="px-4 py-3">
                        {row.date ? new Date(row.date).toLocaleDateString("id-ID", { 
                          day: "2-digit", 
                          month: "long", 
                          year: "numeric" 
                        }) : "-"}
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
                      No data available
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

              <select 
                value={modalType} 
                onChange={(e) => setModalType(e.target.value)} 
                className="border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Type *</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <input 
                value={modalCategory} 
                onChange={(e) => setModalCategory(e.target.value)} 
                type="text" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Category *" 
                required
              />
              <input 
                value={modalMerchant} 
                onChange={(e) => setModalMerchant(e.target.value)} 
                type="text" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Merchant" 
              />
              <input 
                value={modalItem} 
                onChange={(e) => setModalItem(e.target.value)} 
                type="text" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Item" 
              />
              <input 
                value={modalAmount} 
                onChange={(e) => setModalAmount(e.target.value ? Number(e.target.value) : "")} 
                type="number" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Amount" 
              />

              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100" 
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
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
            <h2 className="text-xl font-semibold mb-4">Add New Group</h2>

            <form className="flex flex-col gap-4" onSubmit={submitAddGroup}>
              <DatePicker
                id="modal_group_date"
                placeholder="Date"
                defaultDate={parseYMDToDate(modalDate)}
                onChange={(dates: any[]) => {
                  const d = dates?.[0];
                  if (d) setModalDate(formatDateLocal(d));
                }}
              />
              <input 
                value={modalgroupName} 
                onChange={(e) => setmodalgroupName(e.target.value)} 
                type="text" 
                className="border rounded-lg px-3 py-2" 
                placeholder="Group Name *" 
                required
              />
              
              <select 
                value={modalgroupType} 
                onChange={(e) => setmodalgroupType(e.target.value)} 
                className="border rounded-lg px-3 py-2"
                required
              >
                <option value="">-Type- *</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Bisnis">Bisnis</option>
              </select>
              
              <select 
                value={ModalChannel} 
                onChange={(e) => setModalChannel(e.target.value)} 
                className="border rounded-lg px-3 py-2"
                required
              >
                <option value="">-Channel- *</option>
                <option value="Telegram">Telegram</option>
              </select>
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100" 
                  onClick={() => setcreategroups(false)}
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT REPORT */}
      {showEditModal && editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Report</h2>
            
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
}