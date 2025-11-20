"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  compare?: string;
  className?: string; // << added
}

export function StatCard({ title, value, change, compare, className }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-white/[0.05]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

      <h2
        className={`text-2xl font-semibold mt-2 ${
          className ? className : "text-gray-800 dark:text-white"
        }`}
      >
        {value}
      </h2>

      <div className="text-xs font-medium mt-1 flex items-center gap-1">
        {change && (
          <span
            className={`flex items-center gap-1 ${
              change.toString().startsWith("-") ? "text-red-500" : "text-green-600"
            }`}
          >
            {change.toString().startsWith("-") ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
