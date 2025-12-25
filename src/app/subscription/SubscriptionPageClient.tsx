"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

const steps = ["Registrasi Akun","Verifikasi Akun", "Pembayaran", "Selesai"];

const N8N_BASE_URL = "https://n8n.srv1074739.hstgr.cloud/webhook";

export const dynamic = 'force-dynamic';

export default function SubscriptionPageClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [fullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [proof, setProof] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [virtualAccount, setVirtualAccount] = useState<string>("");
const [selectedBank, setSelectedBank] = useState<string>("");
const [isLoginMode, setIsLoginMode] = useState(false);
const [loginEmail, setLoginEmail] = useState('');
const [loginPassword, setLoginPassword] = useState('');
const [showLoginPassword, setShowLoginPassword] = useState(false);
const [planId, setPlanId] = useState<string>("");

useEffect(() => {
    const pkg = searchParams.get("package");
    if (pkg) {
        setPlanId(pkg);
    }
    const saved = localStorage.getItem("subscription_progress");
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.Email) setEmail(parsed.Email);
        if (parsed.userId) setUserId(parsed.userId);
    }
}, [searchParams]);

    // Load progress dari localStorage
    useEffect(() => {
        const saved = localStorage.getItem("subscription_progress");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.step) setStep(parsed.step);
            if (parsed.fullName) setFullName(parsed.fullName);
            if (parsed.Email) setEmail(parsed.Email);
            if (parsed.userId) setUserId(parsed.userId);
        }
    }, []);

    const saveProgress = (stepNumber: number) => {
    setStep(stepNumber);

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" "); // bisa kosong kalau cuma 1 kata

    localStorage.setItem(
        "subscription_progress",
        JSON.stringify({
            Timestamp: new Date().toISOString(),
            step: stepNumber,
            plan: planName,
            firstName,
            lastName,
            Email,
            userId,
        })
    );
};

const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
        showToast("Mohon masukkan email dan password!", "error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
        showToast("Format email tidak valid!", "error");
        return;
    }
    
    setLoading(true);
    
    try {
        const response = await fetch(`${N8N_BASE_URL}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword,
            }),
        });

        const data = await response.json();

        if (response.ok && response.status === 200) {
           const loggedUserId = data.userId || "";
const loggedEmail = data.email || loginEmail;
const loggedFullName = data.fullName || loginEmail;

setUserId(loggedUserId);
setEmail(loggedEmail); 
setFullName(loggedFullName); 
            
            localStorage.setItem('isRegistered', 'true');
            localStorage.setItem('userData', JSON.stringify({
                fullName: data.fullName || loginEmail,
                email: loginEmail,
                userId: data.userId || "",
                loggedInAt: new Date().toISOString()
            }));
            
            // 🎯 Cek paket gratis
            const isFreePackage = planId === "pk001" || 
                                 planId === "1m" || 
                                 planId === "1y" || 
                                 planName?.toLowerCase().includes("biar kebiasa");
            
            if (isFreePackage) {
                // Paket gratis - langsung aktivasi dan redirect
                localStorage.setItem('activePackageId', '1');
                localStorage.setItem('packageActivatedAt', new Date().toISOString());
                localStorage.removeItem("subscription_progress");
                
                showToast("🎉 Login berhasil! Paket 'Biar Kebiasa' telah aktif!", "success");
                
                setTimeout(() => {
                    router.push("/dashboard-user");
                }, 2000);
            } else {
                // Paket berbayar - lanjut ke pembayaran
                saveProgress(2);
                showToast("Login berhasil! Silakan lanjutkan pembayaran.", "success");
            }
            
        } else {
            const errorMessage = data.message || data.error || "Email atau password salah!";
            showToast(errorMessage, "error");
            
            console.error("Login failed:", {
                status: response.status,
                statusText: response.statusText,
                data: data
            });
        }
        
    } catch (error) {
        console.error("Login error:", error);
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
            showToast("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.", "error");
        } else if (error instanceof SyntaxError) {
            showToast("Terjadi kesalahan saat memproses data dari server.", "error");
        } else {
            showToast("Terjadi kesalahan saat login. Silakan coba lagi.", "error");
        }
    } finally {
        setLoading(false);
    }
};

const switchToLogin = () => {
    setIsLoginMode(true);
    setStep(1); // Pindah ke step 1 untuk menampilkan form login
};

const switchToRegister = () => {
    setIsLoginMode(false);
    setStep(0); // Kembali ke step 0 untuk form registrasi
};

    const nextStep = () => {
        const newStep = Math.min(step + 1, steps.length - 1);
        saveProgress(newStep);
    };

    const prevStep = () => {
    // Jika di login mode dan step 1, kembali ke registrasi
    if (step === 1 && isLoginMode) {
        setIsLoginMode(false);
        setStep(0);
        return;
    }
    
    // Untuk kondisi lainnya, bisa kembali normal
    const newStep = Math.max(step - 1, 0);
    
    // Hapus isRegistered flag jika kembali ke step 0
    if (newStep === 0) {
        localStorage.removeItem('isRegistered');
    }
    
    saveProgress(newStep);
};

    // Step 0: Registrasi
const handleSignUp = async () => {
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");

    if (!termsAccepted) {
        showToast("Harap centang Terms & Conditions sebelum mendaftar.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Password dan konfirmasi password tidak sama.", "error");
        return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        showToast("Password Tidak Sesuai.", "error");
        return;
    }

    if (!fullName || !Email || !password || !confirmPassword) {
        showToast("Semua field harus diisi!", "error");
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`${N8N_BASE_URL}/SignUp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Timestamp: new Date().toISOString(),
                FirstName: firstName,
                LastName: lastName,
                Email,
                password,
                plan: planName,
                planId: planId,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            if (data.userId) {
                setUserId(data.userId);
            }
            
            localStorage.setItem('isRegistered', 'true');
            localStorage.setItem('userData', JSON.stringify({
                fullName,
                Email,
                userId: data.userId || "",
                registeredAt: new Date().toISOString()
            }));
            
            // 🎯 Cek apakah paket gratis
            const isFreePackage = planId === "1" || 
                                 planId === "1m" || 
                                 planId === "1y" || 
                                 planName?.toLowerCase().includes("biar kebiasa");
            
            if (isFreePackage) {
                // Paket gratis - langsung ke step 1 (verifikasi)
                saveProgress(1);
                showToast("Registrasi berhasil! Silakan verifikasi email Anda untuk mengaktifkan paket gratis.", "success");
            } else {
                // Paket berbayar - ke step 1 (verifikasi)
                saveProgress(1);
                showToast("Registrasi berhasil! Silakan verifikasi email Anda.", "success");
            }
            
        } else {
            showToast(data.message || "Registrasi gagal!", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast("Terjadi kesalahan saat registrasi!", "error");
    } finally {
        setLoading(false);
    }
};

    // Step 1: Validasi Akun
const handleValidate = async () => {
    if (!verificationCode) {
        showToast("Masukkan kode verifikasi dari Email Anda.", "error");
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`${N8N_BASE_URL}/verify-account`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Email,
                token: verificationCode,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Kode verifikasi salah.", "error");
            return;
        }

        // ✅ Verifikasi berhasil
        showToast("Email berhasil diverifikasi! ✅", "success");

        // 🎯 Cek apakah paket yang dipilih adalah paket gratis "Biar Kebiasa"
        const isFreePackage = planId === "1" || 
                             planId === "1m" || 
                             planId === "1y" || 
                             planName?.toLowerCase().includes("biar kebiasa");

        if (isFreePackage) {
            // 🎉 Paket gratis - aktivasi otomatis dan redirect
            
            // Simpan status paket aktif
            localStorage.setItem('activePackageId', '1');
            localStorage.setItem('packageActivatedAt', new Date().toISOString());
            
            // Clear subscription progress
            localStorage.removeItem("subscription_progress");
            
            showToast("🎉 Selamat! Anda sudah terdaftar dan paket 'Biar Kebiasa' telah aktif!", "success");
            
            // Redirect ke dashboard setelah 2 detik
            setTimeout(() => {
                router.push("/dashboard-user");
            }, 2000);
            
        } else {
            // 💳 Paket berbayar - lanjut ke pembayaran
            nextStep();
        }

    } catch (error) {
        console.error("Validation error:", error);
        showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
    } finally {
        setLoading(false);
    }
};


    // Step 2: Pembayaran
const handlePayment = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${N8N_BASE_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: packageId,
        email: Email,
        plan: planName,
        amount: Number(price),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Gagal membuat transaksi", "error");
      return;
    }

    // PANGGIL MIDTRANS SNAP
    window.snap.pay(data.snapToken, {
      onSuccess: function (result) {
        console.log("SUCCESS", result);
        showToast("Pembayaran berhasil 🎉");
        nextStep();
      },
      onPending: function (result) {
        console.log("PENDING", result);
        showToast("Menunggu pembayaran");
      },
      onError: function (result) {
        console.log("ERROR", result);
        showToast("Pembayaran gagal", "error");
      },
      onClose: function () {
        showToast("Popup pembayaran ditutup", "info");
      },
    });
  } catch (err) {
    console.error(err);
    showToast("Error koneksi pembayaran", "error");
  } finally {
    setLoading(false);
  }
};

const [paymentDetails, setPaymentDetails] = useState({
    bank: {
        name: "Bank BCA",
        accountNumber: "1234567890",
        accountName: "PT. Monivo Global Teknologi",
        instructions: "Transfer sesuai nominal yang tertera dan upload bukti transfer"
    },
    qris: {
        qrImage: "/path/to/qris-code.png", // Ganti dengan path QR code Anda
        instructions: "Scan QR code menggunakan aplikasi mobile banking atau e-wallet"
    },
    ewallet: {
        options: [
            { name: "GoPay", number: "081234567890" },
            { name: "OVO", number: "081234567890" },
            { name: "Dana", number: "081234567890" }
        ],
        instructions: "Transfer ke nomor e-wallet yang dipilih"
    }
});

// Fungsi untuk generate VA number (bisa dipanggil di backend/N8N)
const generateVirtualAccount = (bankCode: string, userId: string) => {
    // Format: [Bank Code 3 digit][Company Code 4 digit][User ID hash 6 digit]
    const companyCode = "1001"; // Kode perusahaan Anda
    
    // Hash userId menjadi 6 digit
    const userHash = Math.abs(hashCode(userId)).toString().padStart(6, '0').slice(0, 6);
    
    return `${bankCode}${companyCode}${userHash}`;
};

// Simple hash function
const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
};

const bankVAOptions = [
    { 
        code: "014", 
        name: "BCA", 
        logo: "🏦",
        ownerAccount: "1234567890",
        ownerName: "PT. Monivo Global Teknologi"
    },
    { 
        code: "008", 
        name: "Mandiri", 
        logo: "🏦",
        ownerAccount: "9876543210",
        ownerName: "PT. Monivo Global Teknologi"
    },
    { 
        code: "009", 
        name: "BNI", 
        logo: "🏦",
        ownerAccount: "5555666677",
        ownerName: "PT. Monivo Global Teknologi"
    },
    { 
        code: "002", 
        name: "BRI", 
        logo: "🏦",
        ownerAccount: "3333444455",
        ownerName: "PT. Monivo Global Teknologi"
    },
];

// Fungsi untuk generate VA saat user pilih bank
const handleBankSelect = (bankCode: string) => {
    setSelectedBank(bankCode);
    const va = generateVirtualAccount(bankCode, userId || "");
    setVirtualAccount(va);
};

// Tambahkan setelah useEffect yang load subscription_progress
useEffect(() => {
    const isRegistered = localStorage.getItem('isRegistered');
    
    // Jika sudah registrasi dan masih di step 0, langsung ke step 2
    if (isRegistered === 'true' && step === 0 && !isLoginMode) {
        setStep(2);
    }
}, [step, isLoginMode]);

const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  setToast({ show: true, message, type });
  setTimeout(() => {
    setToast({ show: false, message: '', type: 'success' });
  }, 3000); // Hilang setelah 3 detik
};

const handlePay = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${N8N_BASE_URL}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        email: Email,
        plan: planName,
        amount: Number(price),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Gagal membuat transaksi", "error");
      return;
    }

    if (!window.snap) {
      showToast("Midtrans belum siap", "error");
      return;
    }

    window.snap.pay(data.snapToken, {
      onSuccess: () => {
  showToast("Pembayaran diterima. Sedang diproses ⏳", "info");
  router.push("/payment/finish");
},
      onPending: () => {
  router.push("/payment/finish?status=pending");
},
onError: () => {
  router.push("/payment/finish?status=failed");
},
      onClose: () => {
        showToast("Popup pembayaran ditutup", "info");
      },
    });
  } catch (err) {
    console.error(err);
    showToast("Terjadi kesalahan pembayaran", "error");
  } finally {
    setLoading(false);
  }
};

// Ambil langsung dari URL params
const packageId = searchParams.get("package") || "1";
const planName = searchParams.get("plan") || "Biar Kebiasa";
const billingCycle = searchParams.get("billing") || "monthly";
const price = searchParams.get("price") || "0";

// Update useEffect untuk cek apakah localStorage masih relevan
useEffect(() => {
    const saved = localStorage.getItem("subscription_progress");
    if (saved) {
        const parsed = JSON.parse(saved);
        
        // ✅ Cek apakah packageId sama dengan yang di localStorage
        if (parsed.packageId === packageId && parsed.step && parsed.step > 0) {
            // Load progress
        } else {
            // Reset jika beda paket
            localStorage.removeItem("subscription_progress");
        }
    }
}, [packageId]);
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-cyan-50">
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
                {/* Stepper */}
                <div className="w-full max-w-3xl mb-12">
                    <div className="flex justify-between relative">
                        {steps.map((label, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                                        idx <= step
                                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                                >
                                    {idx + 1}
                                </div>
                                <span
                                    className={`mt-2 text-xs sm:text-sm ${
                                        idx === step ? "text-blue-600 font-semibold" : "text-gray-500"
                                    }`}
                                >
                                    {label}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10">
                            <div
                                className="h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500"
                                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Paket Info */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6 max-w-xl w-full">
                    <h3 className="font-semibold text-gray-700 mb-2">Paket Dipilih:</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">{planName}</span>
                        <span className="text-xl font-bold text-gray-900">
                            Rp{parseInt(price).toLocaleString("id-ID")}
                            <span className="text-sm text-gray-500">/{billingCycle === "monthly" ? "bulan" : "tahun"}</span>
                        </span>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* Step 0: Registrasi */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-5"
                            >
                                <h2 className="text-2xl font-bold text-gray-800">Registrasi Akun</h2>
                                <Input
                                    placeholder="Nama Lengkap"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <Input
                                    placeholder="Email"
                                    type="Email"
                                    value={Email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Konfirmasi Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {password && (
                                    <ul className="text-xs text-gray-500 space-y-1">
                                        <li className={password.length >= 8 ? "text-green-600" : "text-red-500"}>
                                            • Minimal 8 karakter
                                        </li>
                                        <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-500"}>
                                            • Ada huruf besar
                                        </li>
                                        <li className={/[0-9]/.test(password) ? "text-green-600" : "text-red-500"}>
                                            • Ada angka
                                        </li>
                                        <li className={password === confirmPassword && password ? "text-green-600" : "text-red-500"}>
                                            • Password cocok
                                        </li>
                                    </ul>
                                )}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Saya menyetujui <span className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    <Link href="/syarat-ketentuan"><b> S&K </b></Link>
                  </span>{" "}
                                    </span>
                                </div>
                                <Button className="w-full mt-4" onClick={handleSignUp} disabled={loading}>
                                    {loading ? "Loading..." : "Daftar & Cek Email →"}
                                </Button>
                                
    <div className="text-center mt-4">
    <button
        type="button"
        onClick={switchToLogin}
        className="text-sm text-blue-600 hover:text-blue-700 underline"
    >
        Sudah punya akun? Login dulu yuk →
    </button>
</div>
                            </motion.div>
                        )}

                        {/* Step 1: Validasi ATAU Login */}
{step === 1 && (
    <AnimatePresence mode="wait">
        {!isLoginMode ? (
            // Mode Verifikasi Email
            <motion.div
                key="step1-verify"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-5 text-center"
            >
                <h2 className="text-2xl font-bold text-gray-800">Verifikasi Akun</h2>
                <p className="text-gray-500">
                    Kami telah mengirim kode verifikasi ke:
                    <br />
                    <span className="font-semibold text-gray-800">{Email}</span>
                </p>
                <Input
                    placeholder="Masukkan Kode Verifikasi"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="text-center text-2xl tracking-widest"
                />
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                    <Button variant="outline" onClick={prevStep}>
                        ← Kembali
                    </Button>
                    <Button onClick={handleValidate} disabled={loading}>
                        {loading ? "Memverifikasi..." : "Verifikasi"}
                    </Button>
                </div>
            </motion.div>
        ) : (
            // Mode Login
            <motion.div
                key="step1-login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-5"
            >
                <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                <p className="text-gray-500">Masuk ke akun Anda</p>
                
                <Input
                    placeholder="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                />
                
                <div className="relative">
                    <Input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="text-right">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                        Lupa password?
                    </button>
                </div>

                <Button className="w-full" onClick={handleLogin} disabled={loading}>
                    {loading ? "Loading..." : "Login →"}
                </Button>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={switchToRegister}
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                        ← Belum punya akun? Daftar dulu
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
)}

                        {/* Step 2: Pembayaran */}
{step === 2 && (
  <>
    <Script
      src="https://app.sandbox.midtrans.com/snap/snap.js"
      data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      strategy="afterInteractive"
    />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
<div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
<h3 className="font-semibold text-gray-800">Ringkasan Pembayaran</h3>
<div className="mt-3 text-sm space-y-1">
<p><b>Paket:</b> {planName}</p>
<p className="text-lg font-bold text-blue-600">
Total: Rp {Number(price).toLocaleString("id-ID")}
</p>
</div>
</div>


<div className="bg-white border rounded-xl p-6 space-y-4">
<h4 className="font-semibold text-gray-800">Metode Pembayaran</h4>
<p className="text-sm text-gray-600">
Anda akan diarahkan ke halaman pembayaran aman Midtrans.
</p>


<ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
<li>Virtual Account (BCA, BRI, BNI, Mandiri)</li>
<li>QRIS</li>
<li>GoPay, ShopeePay, dll</li>
</ul>


<Button
onClick={handlePay}
disabled={loading}
className="w-full"
>
{loading ? "Memproses..." : "Bayar Sekarang"}
</Button>
</div>

<p className="text-xs text-center text-gray-500">
Pembayaran diproses oleh Midtrans • Aman & terenkripsi
</p>
<p className="text-center">
<button
        type="button"
        onClick={prevStep}
        className="text-sm text-blue-600 hover:text-blue-700 underline"
    >
                                        ← Kembali
                                    </button></p>
</motion.div>
  </>
)}

                        {/* Step 3: Selesai */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-5 text-center"
                            >
                                <div className="text-6xl">🎉</div>
                                <h2 className="text-2xl font-bold text-green-600">Selesai!</h2>
                                <p className="text-gray-600">
                                    Akun Anda aktif & pembayaran berhasil. Silakan login ke dashboard.
                                </p>
                                <Button onClick={() => {
                                    localStorage.removeItem("subscription_progress");
                                    router.push("/dashboard-user");
                                }}>
                                    Login ke Dashboard →
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}