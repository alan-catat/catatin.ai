"use client";

import { Suspense } from "react";
import SubscriptionPageClient from "./SubscriptionPageClient";
import Script from "next/script";

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key={process.env.MIDTRANS_CLIENT_KEY}
  strategy="afterInteractive"
/>
      <SubscriptionPageClient />
    </Suspense>
  );
}
