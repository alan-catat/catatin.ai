// utils/email.ts
import nodemailer from "nodemailer";

// Ambil konfigurasi dari environment (.env.local)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // contoh: smtp.gmail.com
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === "true", // true untuk SSL (465)
  auth: {
    user: process.env.EMAIL_USER,     // alamat email pengirim
    pass: process.env.EMAIL_PASS,     // password atau app password
  },
});

/**
 * Kirim email dengan opsi HTML fallback
 * @param to - alamat penerima
 * @param subject - subjek email
 * @param html - isi HTML (opsional)
 * @param text - isi teks biasa (opsional)
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const from = process.env.EMAIL_FROM || '"No Reply" <no-reply@domainmu.com>';

  const htmlTemplate = html || `
    <div style="font-family: sans-serif; color: #333;">
      <h2>${subject}</h2>
      <p>${text || "Tidak ada isi pesan."}</p>
      <br/>
      <p style="font-size: 12px; color: #999;">
        Email ini dikirim otomatis oleh sistem. Mohon tidak membalas.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html?.replace(/<[^>]*>?/gm, "") || "",
      html: htmlTemplate,
    });

    console.log(`📧 Email terkirim ke ${to}: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
    return { success: false, error };
  }
}
