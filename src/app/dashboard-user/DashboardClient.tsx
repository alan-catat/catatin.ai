"use client";

import { useEffect, useState } from "react";
import { useAlert } from "@/components/ui/alert/Alert";

import { StatCard } from "@/components/dashboard/StatCard";
import { PieCart } from "@/components/charts/pie/PieCart";
import { Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign } from "lucide-react";
import { exportToExcel } from "@/utils/exportExcel";
import { USER_OVERVIEWS } from "@/config/variables";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Ganti URL berikut dengan URL n8n kamu
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_GET_CASHFLOW_URL || "https://n8n.srv1074739.hstgr.cloud/webhook-test/get-cashflow";

interface Category {
  id: string;
  name: string;
}

interface CashFlow {
  id: string;
  flow_type: "income" | "expense";
  flow_amount: number;
  created_at: string;
  category: Category;
}

export default function DashboardUser() {
  const { setAlertData } = useAlert();

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  const [cashFlows, setCashFlows] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  const colors = ["text-blue-500", "text-green-500", "text-purple-500", "text-orange-500", "text-pink-500"];
  const icons = [Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign];

  // === Generate Periods ===
  function generatePeriods() {
    const now = new Date();
    const p: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      p.push(`${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`);
    }
    return p.reverse();
  }

  // === Helper ===
  function groupByCategory(data: CashFlow[] | null | undefined, type: "income" | "expense") {
  if (!Array.isArray(data) || data.length === 0) return []; // ✅ pastikan aman

  const grouped: Record<string, number> = {};
  data
    .filter((d) => d.flow_type === type)
    .forEach((row) => {
      const cat = row.category?.name || "Other";
      grouped[cat] = (grouped[cat] || 0) + Math.abs(row.flow_amount);
    });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}


  // === Fetch dari n8n ===
  async function fetchFromN8N(path: string, payload?: any) {
    try {
      const res = await fetch(`${N8N_BASE_URL}/${path}`, {
        method: payload ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("n8n fetch error:", err);
      return null;
    }
  }

  // === Init (ambil user, groups, cashflow awal) ===
  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);

      // ambil data dari n8n
      const [cashFlows, userGroups] = await Promise.all([
        fetchFromN8N("get-cashflows", { user_id: userData.id }),
        fetchFromN8N("get-groups", { user_id: userData.id }),
      ]);

      const p = generatePeriods();
      setPeriods(p);
      setSelectedPeriod(p[p.length - 1]);

      if (cashFlows) setCashFlows(cashFlows);
      if (userGroups) setGroups(userGroups);

      const totalIncome = cashFlows?.filter((f: any) => f.flow_type === "income").reduce((a: number, b: any) => a + Math.abs(b.flow_amount), 0) || 0;
      const totalExpense = cashFlows?.filter((f: any) => f.flow_type === "expense").reduce((a: number, b: any) => a + Math.abs(b.flow_amount), 0) || 0;
      const balance = totalIncome - totalExpense;

      setStats({
        balance,
        totalIncome,
        totalExpense,
        entries: cashFlows?.length || 0,
        incomeData: groupByCategory(cashFlows, "income"),
        expenseData: groupByCategory(cashFlows, "expense"),
      });

      setLoading(false);
    };

    init();
  }, []);

  // === Export handler ===
  const handleExport = async () => {
    if (!user) return alert("Anda belum login");

    const flows = await fetchFromN8N("get-cashflows-filtered", {
      user_id: user.id,
      group_id: selectedGroup,
      period: selectedPeriod,
    });

    if (!flows || !flows.length) {
      alert("Tidak ada data cashflow untuk diexport");
      return;
    }

    exportToExcel(flows, { fileName: "cashflows.xlsx", userId: user.id });
  };

  // === Update data saat filter berubah ===
  useEffect(() => {
    if (!user || !selectedPeriod) return;

    const refresh = async () => {
      const flows = await fetchFromN8N("get-cashflows-filtered", {
        user_id: user.id,
        group_id: selectedGroup,
        period: selectedPeriod,
      });
      if (!flows) return;

      setCashFlows(flows);
      const totalIncome = flows.filter((f: any) => f.flow_type === "income").reduce((a: number, b: any) => a + Math.abs(b.flow_amount), 0);
      const totalExpense = flows.filter((f: any) => f.flow_type === "expense").reduce((a: number, b: any) => a + Math.abs(b.flow_amount), 0);
      const balance = totalIncome - totalExpense;

      setStats({
        balance,
        totalIncome,
        totalExpense,
        entries: flows.length,
        incomeData: groupByCategory(flows, "income"),
        expenseData: groupByCategory(flows, "expense"),
      });
    };

    refresh();
  }, [selectedGroup, selectedPeriod, user]);

  // === Loading dan login ===
  if (loading) return <div className="text-center mt-10">Memuat dashboard...</div>;
  if (!loggedIn) return <div className="text-center text-red-500 mt-10">Anda belum login.</div>;

  // === UI ===
  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            className="border rounded-lg px-3 py-2 dark:text-gray-400 w-full sm:w-auto"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <DatePicker
            selected={
              selectedPeriod
                ? new Date(`${selectedPeriod.split(" ")[0]} 1, ${selectedPeriod.split(" ")[1]}`)
                : null
            }
            onChange={(date) => {
              if (!date) return;
              const month = date.toLocaleString("en-US", { month: "long" });
              const year = date.getFullYear();
              setSelectedPeriod(`${month} ${year}`);
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            includeDates={periods.map(
              (p) => new Date(`${p.split(" ")[0]} 1, ${p.split(" ")[1]}`)
            )}
            className="border rounded-lg px-3 py-2 dark:text-gray-400 w-full sm:w-auto"
          />
        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 w-full sm:w-auto bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={USER_OVERVIEWS.totalBalance.title} value={`$${stats.balance}`} change={`-`} compare={USER_OVERVIEWS.totalBalance.compare} />
        <StatCard title={USER_OVERVIEWS.totalIncome.title} value={`$${stats.totalIncome}`} change={`-`} compare={USER_OVERVIEWS.totalIncome.compare} />
        <StatCard title={USER_OVERVIEWS.totalExpense.title} value={`$${stats.totalExpense}`} change={`-`} compare={USER_OVERVIEWS.totalExpense.compare} />
        <StatCard title={USER_OVERVIEWS.entries.title} value={stats.entries} change={`-`} compare={USER_OVERVIEWS.entries.compare} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieCart title={USER_OVERVIEWS.incomeChartBreakdown.title} data={stats.incomeData} total={stats.totalIncome} />
        <PieCart title={USER_OVERVIEWS.expenseChartBreakdown.title} data={stats.expenseData} total={stats.totalExpense} />
      </div>

      {/* Category Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700 dark:bg-white/5">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-400">
            {USER_OVERVIEWS.incomeChart.title}
          </h2>
          <div className="space-y-3">
            {stats.incomeData?.map((item: any, idx: number) => {
              const Icon = icons[idx % icons.length];
              const color = colors[idx % colors.length];
              return (
                <div key={item.name} className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">${item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700 dark:bg-white/5">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-400">
            {USER_OVERVIEWS.expenseChart.title}
          </h2>
          <div className="space-y-3">
            {stats.expenseData?.map((item: any, idx: number) => {
              const Icon = icons[idx % icons.length];
              const color = colors[idx % colors.length];
              return (
                <div key={item.name} className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">${item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
