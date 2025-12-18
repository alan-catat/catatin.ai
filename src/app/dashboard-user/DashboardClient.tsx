"use client";

import { useEffect, useState, forwardRef, useRef } from "react";
import { useAlert } from "@/components/ui/alert/Alert";
import { StatCard } from "@/components/dashboard/StatCard";
import { PieCart } from "@/components/charts/pie/PieCart";
import { Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign, ChevronDown, X, Check } from "lucide-react";
import { USER_OVERVIEWS } from "@/config/variables";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "@/components/form/date-picker";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

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

interface kategori {
  id: string;
  name: string;
}

interface CashFlow {
  id: string;
  flow_type: "income" | "expense";
  flow_amount: number;
  created_at: string;
  user_id: string;
  category: kategori;
  group_name?: string;
  item: string;
  merchant?: string;
}

function getLargestIncome(cashflows: CashFlow[]) {
  if (!cashflows.length) return [];
  const items = cashflows
    .filter((d) => d.flow_type === "income")
    .map((d) => ({
      name: d.item,
      qty: 1,
      amount: d.flow_amount,
    }));
  items.sort((a, b) => b.amount - a.amount);
  return items.slice(0, 5);
}

function getMostExpensive(cashflows: CashFlow[]) {
  if (!cashflows.length) return [];
  const items = cashflows
    .filter((d) => d.flow_type === "expense")
    .map((d) => ({
      name: d.item,
      qty: 1,
      amount: d.flow_amount,
    }));
  items.sort((a, b) => b.amount - a.amount);
  return items.slice(0, 5);
}

export default function DashboardUser() {
  const { setAlertData } = useAlert();
    const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mostExpensive, setMostExpensive] = useState<any[]>([]);
  const [largestIncome, setLargestIncome] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [stats, setStats] = useState<any>({});
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [groups, setGroups] = useState<string[]>([]);
  const [tempDateFrom, setTempDateFrom] = useState<string>("");
      const [tempDateTo, setTempDateTo] = useState<string>("");
      const [dateFrom, setDateFrom] = useState<string>("");
const [dateTo, setDateTo] = useState<string>("");

  
  // ✅ PERUBAHAN: Tambah state untuk multi-select (nama variable baru agar tidak bentrok)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // ✅ State untuk temporary filter (belum apply)
  const [tempPeriod, setTempPeriod] = useState<string>("");
  const [tempGroups, setTempGroups] = useState<string[]>([]);


  

  const colors = ["text-blue-500", "text-green-500", "text-purple-500", "text-orange-500", "text-pink-500"];
  const icons = [Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign];

  const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button
      onClick={onClick}
      ref={ref}
      className="border rounded-lg px-3 py-2 dark:text-gray-400 w-full sm:w-auto text-left"
    >
      {value || "Pilih periode"}
    </button>
  ));
  CustomInput.displayName = "CustomInput";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function generatePeriods() {
    const now = new Date();
    const periods: string[] = ["All Time"];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toLocaleString("en-US", { month: "long" });
      const year = d.getFullYear();
      periods.push(`${month} ${year}`);
    }
    return periods.reverse();
  }

  function groupByCategory(data: CashFlow[], type: "income" | "expense") {
    const grouped: Record<string, number> = {};
    data
      .filter((d) => d.flow_type === type)
      .forEach((row) => {
        const cat = row.category?.name || "Other";
        grouped[cat] = (grouped[cat] || 0) + Math.abs(row.flow_amount);
      });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }

  async function fetchCashFlows(period?: string, groupName?: string) {
  try {
    // ✅ Pakai email dari auth context (dari cookie)
    if (!user?.email) {
      console.warn("User tidak terauthentikasi");
      return [];
    }
    const storedEmail = user.email;
    console.log('📧 Fetching cashflows for:', storedEmail);

      const url = process.env.NEXT_PUBLIC_N8N_GETCASHFLOW_URL;
      if (!url) throw new Error("NEXT_PUBLIC_N8N_GETCASHFLOW_URL");

      // ✅ SELALU kirim groupName, default "All Groups"
      const requestBody: any = {
        email: storedEmail,
        groupName: groupName || "All Groups",
        date_from: dateFrom || "",
      date_to: dateTo || "",
      };

      console.log('=== SENDING TO N8N ===');
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
      console.log('======================');

      const res = await fetch(`${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        console.error('Response not OK:', res.status);
        throw new Error("Gagal fetch data dari n8n");
      }

      const result = await res.json();

      const formatted: CashFlow[] = (Array.isArray(result) ? result : result.data || []).map(
        (r: any, i: number) => ({
          id: String(i),
          flow_type: r.type,
          flow_amount: Math.abs(Number(r.amount)) || 0,
          created_at: new Date(r.transaction_date).toISOString(),
          user_id: storedEmail,
          category: r.kategori || "Unknown",
          group_name: r.group_name || "Unknown",
          item: r.items,
          merchant: r.merchant || "",
        })
      );

      setCashFlows(formatted);
      const uniqueGroups = Array.from(new Set(formatted.map(f => f.group_name).filter(Boolean)));
      setGroups(uniqueGroups as string[]);

      return formatted;
    } catch (err) {
      console.error(err);
      setCashFlows([]);
      return [];
    }
  }

  function calculateStats(data: CashFlow[]) {
    const totalIncome = data.filter((f) => f.flow_type === "income").reduce((a, b) => a + b.flow_amount, 0);
    const totalExpense = data.filter((f) => f.flow_type === "expense").reduce((a, b) => a + b.flow_amount, 0);
    const balance = totalIncome - totalExpense;
      
    const incomeData = groupByCategory(data, "income");
    const expenseData = groupByCategory(data, "expense");

    return { balance, totalIncome, totalExpense, entries: data.length, incomeData, expenseData };
  }

  // ✅ Multi-select functions
  const toggleGroup = (group: string) => {
    setTempGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const removeGroup = (group: string) => {
    setTempGroups(prev => prev.filter(g => g !== group));
  };

  const clearAllGroups = () => {
    setTempGroups([]);
  };
  
  // ✅ Function untuk Apply filter
  const handleApplyFilter = () => {
    setSelectedPeriod(tempPeriod);
    setSelectedGroups(tempGroups);
    setDateFrom(tempDateFrom);
  setDateTo(tempDateTo);
  };

// 1. Set mounted on first render
useEffect(() => {
  setMounted(true);
}, []);

// 2. Handle auth redirect
useEffect(() => {
  if (!mounted) return;
  
  if (!authLoading && !user) {
    console.log('❌ Not authenticated, redirecting to signin');
    router.push('/auth/dashboard-user/signin');
  }
}, [mounted, authLoading, user, router]);

// 3. Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

// 4. Initialize dashboard when user is authenticated
useEffect(() => {
  console.log('🔵 useEffect #4 triggered:', { 
    mounted, 
    authLoading, 
    hasUser: !!user, 
    userEmail: user?.email 
  });

  if (!mounted || authLoading || !user?.email) {
    console.log('⏳ Waiting for auth...', { mounted, authLoading, hasUser: !!user });
    return;
  }

  const init = async () => {
    console.log('🚀 Initializing dashboard for:', user.email);
    
    try {
      const p = generatePeriods();
      console.log('📅 Periods generated:', p.length);
      setPeriods(p);
      
      console.log('📡 Fetching cashflows...');
      const flows = await fetchCashFlows(p[p.length - 1], "All Groups");
      console.log('✅ Cashflows fetched:', flows.length, 'items');
      
      setSelectedPeriod(p[p.length - 1]);
      setTempPeriod(p[p.length - 1]);
      setSelectedGroups([]);
      setTempGroups([]);
      
      const calculatedStats = calculateStats(flows);
      console.log('📊 Stats calculated:', calculatedStats);
      setStats(calculatedStats);
      
      setMostExpensive(getMostExpensive(flows));
      setLargestIncome(getLargestIncome(flows));
      setLoading(false);
      console.log('✅ Dashboard initialized!');
    } catch (error) {
      console.error('❌ Init error:', error);
      setLoading(false); // ← PENTING: Set loading false even on error
    }
  };
  
  init();
}, [mounted, authLoading, user]);

// 5. Update data when filters change
useEffect(() => {
  if (!selectedPeriod || !mounted || authLoading || !user) return;

  (async () => {
    try {
      setChartLoading(true);
      const flows = await fetchCashFlows(selectedPeriod, "All Groups");
      
      // Filter by groups
      let filteredFlows = selectedGroups.length === 0 
        ? flows 
        : flows.filter(f => selectedGroups.includes(f.group_name || ''));
      
      // Filter by date range
      if (dateFrom || dateTo) {
        filteredFlows = filteredFlows.filter(f => {
          const flowDate = new Date(f.created_at);
          const fromDate = dateFrom ? new Date(dateFrom) : null;
          const toDate = dateTo ? new Date(dateTo) : null;
          
          if (fromDate && flowDate < fromDate) return false;
          if (toDate && flowDate > toDate) return false;
          return true;
        });
      }
      
      const newStats = calculateStats(filteredFlows);
      setStats(newStats);
      setMostExpensive(getMostExpensive(filteredFlows));
      setLargestIncome(getLargestIncome(filteredFlows));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setChartLoading(false);
    }
  })();
}, [selectedPeriod, selectedGroups, dateFrom, dateTo, mounted, authLoading, user]);

if (!mounted) {
  return null;
}

if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Memeriksa autentikasi...</p>
      </div>
    </div>
  );
}

if (!user) {
  return null;
}

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat data dashboard...</p>
      </div>
    </div>
  );
}

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          
          {/* ✅ Multi-Select Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-64 border rounded-lg px-4 py-2 dark:bg-neutral-800 dark:text-gray-300 
                       dark:border-gray-600 bg-white text-left flex items-center justify-between
                       hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {tempGroups.length === 0
                  ? 'Semua Group'
                  : `${tempGroups.length} group dipilih`}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border 
                            dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-auto">
                {groups.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada group tersedia
                  </div>
                ) : (
                  groups.map((group) => (
                    <label
                      key={group}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 
                               cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={tempGroups.includes(group)}
                        onChange={() => toggleGroup(group)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 
                                 dark:border-gray-600 dark:bg-neutral-700 cursor-pointer"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300 flex-1">
                        {group}
                      </span>
                      {tempGroups.includes(group) && (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

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
          
          
          {/* ✅ Tombol Apply */}
          <button
            onClick={handleApplyFilter}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium 
                     transition-colors shadow-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Selected Groups Tags */}
      {tempGroups.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Dipilih (belum diterapkan):
          </span>
          {tempGroups.map((group) => (
            <div
              key={group}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900 
                       text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium"
            >
              {group}
              <button
                onClick={() => removeGroup(group)}
                className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={clearAllGroups}
            className="text-xs text-red-600 dark:text-red-400 hover:underline ml-2"
          >
            Hapus semua
          </button>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Menampilkan data untuk: <span className="font-semibold">{selectedGroups.length === 0 ? 'Semua Group' : selectedGroups.join(', ')}</span> • <span className="font-semibold">{selectedPeriod}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={USER_OVERVIEWS.totalBalance.title}
          value={`Rp${Math.abs(stats.balance || 0).toLocaleString()}`}
          className={stats.balance < 0 ? "text-red-500" : ""}
        />
        <StatCard title={USER_OVERVIEWS.totalIncome.title} value={`Rp${(stats.totalIncome || 0).toLocaleString()}`} />
        <StatCard title={USER_OVERVIEWS.totalExpense.title} value={`Rp${(stats.totalExpense || 0).toLocaleString()}`} />
        <StatCard title={USER_OVERVIEWS.entries.title} value={stats.entries || 0} />
      </div>

      {/* Charts + Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartLoading ? (
          <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4 flex items-center justify-center h-64">
            <p className="text-gray-500">Memuat grafik...</p>
          </div>
        ) : (
          <PieCart
            key={`income-${selectedPeriod}-${selectedGroups.join(',')}`}
            title={USER_OVERVIEWS.incomeChartBreakdown.title}
            data={stats.incomeData || []}
            total={stats.totalIncome || 0}
          />
        )}

        {chartLoading ? (
          <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4 flex items-center justify-center h-64">
            <p className="text-gray-500">Memuat grafik...</p>
          </div>
        ) : (
          <PieCart
            key={`expense-${selectedPeriod}-${selectedGroups.join(',')}`}
            title={USER_OVERVIEWS.expenseChartBreakdown.title}
            data={stats.expenseData || []}
            total={stats.totalExpense || 0}
          />
        )}

        {/* Largest Income Table */}
        <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-3">Sumber Pendapatan Terbesar</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                <th className="py-2">Nama Item</th>
                <th className="py-2">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {largestIncome.map((i, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2">{i.name}</td>
                  <td className="py-2 font-medium">Rp{i.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Most Expensive Purchases */}
        <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-3">Pengeluaran Termahal</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                <th className="py-2">Nama Item</th>
                <th className="py-2">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {mostExpensive.map((i, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2">{i.name}</td>
                  <td className="py-2 font-medium">Rp{i.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}