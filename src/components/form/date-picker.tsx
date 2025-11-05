"use client";

import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";

// Type definitions dari flatpickr
import type { Hook, DateOption } from "flatpickr/dist/types/options";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
  className = "",
}: PropsType) {
  useEffect(() => {
    // Inisialisasi Flatpickr
    const flatpickrInstance = flatpickr(`#${id}`, {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });

    // Cleanup saat unmount
    return () => {
      if (Array.isArray(flatpickrInstance)) {
      flatpickrInstance.forEach((fp) => fp.destroy());
    } else {
      flatpickrInstance.destroy();
    }
  };
  }, [id, mode, onChange, defaultDate]);

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder || "Select date"}
          readOnly
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 
            focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 
            focus:border-brand-300 focus:ring-brand-500/20 
            dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 
            dark:border-gray-700 dark:focus:border-brand-800 ${className}`}
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
