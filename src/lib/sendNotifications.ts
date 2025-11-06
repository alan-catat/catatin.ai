export async function sendNotification({
  user,
  message,
  avatar,
  user_id,
}: {
  user: string;
  message: string;
  avatar?: string;
  user_id?: string;
}) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_NOTIFICATION_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        user,
        message,
        avatar: avatar || "https://i.pravatar.cc/40?u=" + user,
      }),
    });

    if (!res.ok) {
      console.error("Gagal kirim notifikasi:", await res.text());
    } else {
      console.log("✅ Notifikasi terkirim ke n8n");
    }
  } catch (err) {
    console.error("❌ Error kirim notifikasi:", err);
  }
}
