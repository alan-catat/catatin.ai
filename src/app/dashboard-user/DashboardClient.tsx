"use client";

import { useEffect, useState, forwardRef } from "react";
import { useAlert } from "@/components/ui/alert/Alert";
import { StatCard } from "@/components/dashboard/StatCard";
import { PieCart } from "@/components/charts/pie/PieCart";
import { Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign } from "lucide-react";
import { USER_OVERVIEWS } from "@/config/variables";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Item } from "@radix-ui/react-dropdown-menu";

interface Category {
  id: string;
  name: string;
}

interface CashFlow {
  id: string;
  flow_type: "income" | "expense";
  flow_amount: number;
  created_at: string;
  user_id: string;
  category: Category;
  group_name?: string;
  item: string;
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
  return items.slice(0, 5); // top 5 termahal
}

export default function DashboardUser() {
  const { setAlertData } = useAlert();
const [mostExpensive, setMostExpensive] = useState<any[]>([]);
const [largestIncome, setLargestIncome] = useState<any[]>([]);
 const [chartLoading, setChartLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [stats, setStats] = useState<any>({});
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("All Groups");
  // Warna dan ikon (optional)
  const colors = ["text-blue-500", "text-green-500", "text-purple-500", "text-orange-500", "text-pink-500"];
  const icons = [Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign];

  // Custom input utk DatePicker (tombol bukan input)
  const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button
      onClick={onClick}
      ref={ref}
      className="border rounded-lg px-3 py-2 dark:text-gray-400 w-full sm:w-auto text-left"
    >
      {value || "Select period"}
    </button>
  ));
  CustomInput.displayName = "CustomInput";

  // === Generate daftar bulan ===
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

  // === Grouping kategori ===
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

  // === POST ke n8n (utk filter per user & periode) ===
  async function fetchCashFlows(period?: string, groupName?: string) {
    try {
      const storedEmail = typeof window !== "undefined" ? localStorage.getItem("user_email") : null;
      if (!storedEmail) {
        console.warn("Email user tidak ditemukan di localStorage");
        return [];
      }

      const url = process.env.NEXT_PUBLIC_N8N_GETCASHFLOW_URL;
      if (!url) throw new Error("NEXT_PUBLIC_N8N_GETCASHFLOW_URL");

      const requestBody: any = {
      email: storedEmail,
      period: period === "All Time" ? null : (period || null),
      groupName: selectedGroup
    };
    if (groupName !== undefined && groupName !== "All Groups") {
      requestBody.group_name = groupName;
    }

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
          flow_type: r.flow_type || (Number(r.flow_amount) >= 0 ? "income" : "expense"),
          flow_amount: Math.abs(Number(r.flow_amount)) || 0,
          created_at: r.flow_date ? new Date(r.flow_date).toISOString() : new Date().toISOString(),
          user_id: storedEmail,
          category: { id: r.flow_category, name: r.flow_category || "Unknown" },
          group_name: r.group_name || "Unknown",
          item: r.flow_items,
        })
      );

      setCashFlows(formatted);
      const uniqueGroups = Array.from(new Set(formatted.map(f => f.group_name).filter(Boolean)));
      setGroups(["All Groups", ...uniqueGroups] as string[]);
      
      return formatted;
    } catch (err) {
      console.error(err);
      setCashFlows([]);
      return [];
    }
  }

  // === Hitung statistik ===
  function calculateStats(data: CashFlow[]) {
    const totalIncome = data.filter((f) => f.flow_type === "income").reduce((a, b) => a + b.flow_amount, 0);
    const totalExpense = data.filter((f) => f.flow_type === "expense").reduce((a, b) => a + b.flow_amount, 0);
    const balance = totalIncome - totalExpense;

    const incomeData = groupByCategory(data, "income");
    const expenseData = groupByCategory(data, "expense");

     return { balance, totalIncome, totalExpense, entries: data.length, incomeData, expenseData };
  }

  useEffect(() => {
  const init = async () => {
    const p = generatePeriods();
    setPeriods(p);
    const flows = await fetchCashFlows(p[p.length - 1], undefined); // undefined dulu
    setSelectedPeriod(p[p.length - 1]);
      setSelectedGroup("All Groups");
    setStats(calculateStats(flows));
    setMostExpensive(getMostExpensive(flows));
    setLargestIncome(getLargestIncome(flows));
    setLoading(false);
  setTimeout(() => {
      setSelectedGroup("All Groups");
    }, 100);
  };
  init();
}, []);

useEffect(() => {
  if (!selectedPeriod) return;
  
  (async () => {
    try {
      setChartLoading(true);
      
      const flows = await fetchCashFlows(selectedPeriod);
      const newStats = calculateStats(flows);
      
      setStats(newStats);
      setMostExpensive(getMostExpensive(flows));
      setLargestIncome(getLargestIncome(flows));
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty data on error
      setStats({});
      setMostExpensive([]);
      setLargestIncome([]);
    } finally {
      setChartLoading(false); // ← PINDAH KE FINALLY supaya PASTI dipanggil
    }
  })();
}, [selectedPeriod, selectedGroup]);;

  if (loading) return <div className="text-center mt-10">Memuat dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-neutral-800 dark:text-gray-400 dark:border-gray-600"
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <DatePicker
            selected={
              selectedPeriod === "All Time" || !selectedPeriod
                ? null // ← Handle "All Time"
                : new Date(`${selectedPeriod.split(" ")[0]} 1, ${selectedPeriod.split(" ")[1]}`)
            }
            onChange={(date) => {
              if (!date) return;
              const month = date.toLocaleString("en-US", { month: "long" });
              const year = date.getFullYear();
              setSelectedPeriod(`${month} ${year}`);
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            customInput={<CustomInput />}
            placeholderText="Select period or All Time"
          />
          <button
            onClick={() => setSelectedPeriod("All Time")}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedPeriod === "All Time"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-neutral-700"
            }`}
          >
            Semua
          </button>
        </div>
      </div>
<div className="text-sm text-gray-600 dark:text-gray-400">
        Showing data for: <span className="font-semibold">{selectedGroup}</span> • <span className="font-semibold">{selectedPeriod}</span>
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

  {/* Income Category Breakdown */}
  {chartLoading ? ( 
          <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4 flex items-center justify-center h-64">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        ) : (
          <PieCart
            key={`income-${selectedPeriod}`}
            title={USER_OVERVIEWS.incomeChartBreakdown.title}
            data={stats.incomeData || []}
            total={stats.totalIncome || 0}
          />
        )}

        {/* Expense Category Breakdown */}
        {chartLoading ? ( // ← TAMBAH INI - Loading state
          <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4 flex items-center justify-center h-64">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        ) : (
          <PieCart
            key={`expense-${selectedPeriod}`}
            title={USER_OVERVIEWS.expenseChartBreakdown.title}
            data={stats.expenseData || []}
            total={stats.totalExpense || 0}
          />
        )}
 
  {/* Largest Income Table */}
  <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4">
    <h2 className="font-semibold text-lg mb-3">Largest Income Sources</h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
          <th className="py-2">Nama Item</th>
          <th className="py-2">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {largestIncome.map((i, idx) => (
          <tr
            key={idx}
            className="border-b border-gray-100 dark:border-gray-800"
          >
            <td className="py-2">{i.name}</td>
            <td className="py-2 font-medium">Rp{i.amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

 

  {/* Most Expensive Purchases */}
  <div className="bg-white dark:bg-neutral-900 shadow rounded-lg p-4">
    <h2 className="font-semibold text-lg mb-3">Most Expensive Purchases</h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
          <th className="py-2">Item Name</th>
          <th className="py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {mostExpensive.map((i, idx) => (
          <tr
            key={idx}
            className="border-b border-gray-100 dark:border-gray-800"
          >
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
