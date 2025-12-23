'use client'

import { useEffect, useState } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Paket from "./paket"

export default function SubscriptionPage() {
  const [history, setHistory] = useState<any[]>([])
  const [activePlan, setActivePlan] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [showPlans, setShowPlans] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`/subscription`)
      if (!res.ok) throw new Error("Failed fetch subscription")

      const data = await res.json()

      setHistory(data.history || [])
      setActivePlan(data.activePlan || null)
      setPlans(data.availablePlans || [])
    } catch (err) {
      console.error(err)
    }
  }

  fetchData()
}, [page])

  const handleUpgrade = () => {
    setShowPlans(true)
  }

  const handleRenew = async () => {
    // TODO: arahkan ke payment gateway / buat invoice baru
    alert("Renew subscription clicked")
  }

const handleChoosePlan = async (plan: any) => {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: plan.id,
        planName: plan.name,
        amount: Number(plan.harga)
      })
    })

    if (!res.ok) throw new Error("Checkout failed")

    const data = await res.json()

    const snap = (window as any).snap
    if (!snap) {
      const script = document.createElement("script")
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js"
      script.setAttribute("data-client-key", data.clientKey)
      document.body.appendChild(script)
      script.onload = () => (window as any).snap.pay(data.token)
    } else {
      snap.pay(data.token)
    }
  } catch (err) {
    console.error(err)
  }
}

const handleCancel = async () => {
  await fetch("/api/subscription/cancel", { method: "POST" })
}

  return (
    <div className="p-6 space-y-6">
      <Paket />
      {/* === Plan Info === */}
      {activePlan && (
        <div className="border rounded-xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
                  bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          {/* Info Plan */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Plan: {activePlan.plan}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {activePlan.status === "paid"
                ? "Your subscription is active."
                : "Your subscription is inactive."}
            </p>
            <p className="text-blue-600 font-medium mt-1">{activePlan.amount}</p>
          </div>

          {/* Tombol Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:ml-auto w-full sm:w-auto">
            {activePlan.status === "active" ? (
              <button
                onClick={handleUpgrade}
                className="w-full sm:w-auto border rounded-lg px-4 py-2 
               bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
               hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Upgrade Plan
              </button>
            ) : (
              <button
                onClick={handleRenew}
                className="w-full sm:w-auto border rounded-lg px-4 py-2 
               bg-white dark:bg-gray-900 text-blue-600 
               hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Renew Plan
              </button>
            )}


            <button
              onClick={handleCancel}
              className="border px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-600 border-red-300 dark:border-red-700 w-full sm:w-auto"
            >
              Stop Subscription
            </button>
          </div>
        </div>
      )}



      {/* === Billing History Table === */}
      <div className="border rounded-xl overflow-hidden border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[600px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Invoice ↓</th>
                <th className="px-4 py-3 text-left">Billing Date ↓</th>
                <th className="px-4 py-3 text-left">Status ↓</th>
                <th className="px-4 py-3 text-left">Amount ↓</th>
                <th className="px-4 py-3 text-left">Plan ↓</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">#{row.id}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{row.date}</td>
                  <td className="px-4 py-3">
                    {row.status === "active" ? (
                      <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></span>
                        {row.status}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <span className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{row.amount}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{row.plan}</td>
                  <td className="px-4 py-3 text-right">
                    {row.invoiceUrl && (
                      <a
                        href={row.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        ⬇️
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Pagination === */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-800 dark:text-gray-200">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 border-gray-300 dark:border-gray-600"
        >
          ← Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          Next →
        </button>
      </div>



      {/* === Modal Pilih Plan === */}
      <AnimatePresence>
        {showPlans && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative"
            >
              {/* Tombol close */}
              <button
                onClick={() => setShowPlans(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-semibold mb-4">Pilih Plan Baru</h3>

              {/* Grid Plans */}
              <div className="grid gap-4 md:grid-cols-2 max-h-[70vh] overflow-y-auto pr-2">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <h4 className="font-semibold text-lg">{plan.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Rp {parseInt(plan.harga).toLocaleString()} /{" "}
                        {plan.billing_cycle}
                      </p>

                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {(() => {
                          try {
                            const arr = JSON.parse(plan.features)
                            if (Array.isArray(arr)) {
                              return arr.map((f: string, idx: number) => (
                                <li key={idx}>{f}</li>
                              ))
                            }
                            return <li>{plan.features}</li>
                          } catch {
                            return <li>{plan.features}</li>
                          }
                        })()}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleChoosePlan(plan)}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      Pilih Plan
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
