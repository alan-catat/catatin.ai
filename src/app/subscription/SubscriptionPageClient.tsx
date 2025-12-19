"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const steps = ["Registrasi Akun","Verifikasi Akun", "Pembayaran", "Selesai"];

const N8N_BASE_URL = "https://n8n.srv1074739.hstgr.cloud/webhook";

export default function SubscriptionPageClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const packageId = searchParams.get("package");
    const planName = searchParams.get("plan") || "Biar Kebiasa";
    const billingCycle = searchParams.get("billing") || "monthly";
    const price = searchParams.get("price") || "0";

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

        if (response.ok) {
            // Simpan data user dari login
            if (data.userId) {
                setUserId(data.userId);
            }
            if (data.email) {
                setEmail(data.email);
            }
            if (data.fullName) {
                setFullName(data.fullName);
            }
            
            localStorage.setItem('isRegistered', 'true');
            localStorage.setItem('userData', JSON.stringify({
                fullName: data.fullName || loginEmail,
                Email: loginEmail,
                userId: data.userId || "",
                loggedInAt: new Date().toISOString()
            }));
            
            // Langsung ke step pembayaran
            saveProgress(2);
            showToast("Login berhasil! Silakan lanjutkan pembayaran.", "success");
        } else {
            showToast(data.message || "Email atau password salah!", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast("Terjadi kesalahan saat login!", "error");
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
    const handleSignup = async () => {
        const nameParts = fullName.trim().split(/\s+/);
const firstName = nameParts[0] || "";
const lastName = nameParts.slice(1).join(" ");

        if (!termsAccepted) {
            showToast("Harap centang Terms & Conditions sebelum mendaftar.");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Password dan konfirmasi password tidak sama.");
            return;
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            showToast("Password Tidak Sesuai.");
            return;
        }

         if (!fullName || !Email || !password || !confirmPassword) {
         showToast("Semua field harus diisi!");
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
            packageId,
        }),
    });

            const data = await response.json();

            if (response.ok) {
    // Simpan userId dari response jika ada
    if (data.userId) {
        setUserId(data.userId);
    }
    
    localStorage.setItem('isRegistered', 'true');
    localStorage.setItem('userData', JSON.stringify({
        fullName,
        Email,
        userId: data.userId || "", // Simpan userId juga
        registeredAt: new Date().toISOString()
    }));
    
    // Update progress dengan step 2
    saveProgress(2);
    
    showToast("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
} else {
      showToast(data.message || "Registrasi gagal!");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Terjadi kesalahan saat registrasi!");
  } finally {
    setLoading(false);
  }
};

    // Step 1: Validasi Akun
    const handleValidate = async () => {
        if (!verificationCode) {
            showToast("Masukkan kode verifikasi dari Email Anda.");
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
                showToast(data.message || "Kode verifikasi salah.");
                return;
            }

            showToast("Email berhasil diverifikasi! ✅");
            nextStep();
        } catch (error) {
            console.error("Validation error:", error);
            showToast("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Pembayaran
    const handlePayment = async () => {
        if (!paymentMethod) {
            showToast("Pilih metode pembayaran");
            return;
        }
        if (paymentMethod === 'va' && !virtualAccount) {
        showToast("Pilih bank untuk generate Virtual Account");
        return;
    }

    // Validasi bukti transfer
    if (!proof) {
        showToast("Upload bukti transfer terlebih dahulu");
        return;
    }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("userId", userId || "");
            formData.append("Email", Email);
            formData.append("plan", planName);
            formData.append("billingCycle", billingCycle);
            formData.append("amount", price);
            formData.append("paymentMethod", paymentMethod);
            if (paymentMethod === 'va') {
            formData.append("virtualAccount", virtualAccount);
            formData.append("bankCode", selectedBank);
        }
        
        if (proof) formData.append("proof", proof);

            const response = await fetch(`${N8N_BASE_URL}/payment`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.message || "Pembayaran gagal.");
                return;
            }

            showToast("Pembayaran berhasil diproses! 💳");
            nextStep();
        } catch (error) {
            console.error("Payment error:", error);
            showToast("Terjadi kesalahan saat memproses pembayaran.");
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
                    <Link href="/T&C"><b> S&K </b></Link>
                  </span>{" "}
                                    </span>
                                </div>
                                <Button className="w-full mt-4" onClick={handleSignup} disabled={loading}>
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
    <motion.div
        key="step2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-5"
    >
        <h2 className="text-2xl font-bold text-gray-800">Pembayaran</h2>
        
        {/* Ringkasan Pembayaran */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Ringkasan Pembayaran</h3>
            <div className="space-y-1 text-sm">
                <p><span className="font-medium">Paket:</span> {planName}</p>
                <p><span className="font-medium">Periode:</span> {billingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                    Total: Rp {parseInt(price).toLocaleString('id-ID')}
                </p>
            </div>
        </div>

        {/* Pilihan Metode Pembayaran */}
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Pilih Metode Pembayaran</h3>
            
            {/* Transfer Bank */}
            <label className="block">
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="payment"
                            value="bank"
                            checked={paymentMethod === 'bank'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                        />
                        <div className="flex-1">
                            <span className="font-medium">Transfer Bank</span>
                            <p className="text-sm text-gray-500">Transfer melalui ATM, Internet Banking, atau Mobile Banking</p>
                        </div>
                    </div>
                </div>
            </label>

            {/* QRIS */}
            <label className="block">
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="payment"
                            value="qris"
                            checked={paymentMethod === 'qris'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                        />
                        <div className="flex-1">
                            <span className="font-medium">QRIS</span>
                            <p className="text-sm text-gray-500">Scan & bayar dengan semua aplikasi pembayaran</p>
                        </div>
                    </div>
                </div>
            </label>

            {/* E-Wallet */}
            <label className="block">
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="payment"
                            value="ewallet"
                            checked={paymentMethod === 'ewallet'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                        />
                        <div className="flex-1">
                            <span className="font-medium">E-Wallet</span>
                            <p className="text-sm text-gray-500">GoPay, OVO, Dana, dan lainnya</p>
                        </div>
                    </div>
                </div>
            </label>
        </div>

        <label className="block">
    <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
        <div className="flex items-center">
            <input
                type="radio"
                name="payment"
                value="va"
                checked={paymentMethod === 'va'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
            />
            <div className="flex-1">
                <span className="font-medium">Virtual Account</span>
                <p className="text-sm text-gray-500">Nomor rekening virtual khusus untuk Anda</p>
            </div>
        </div>
    </div>
</label>

        {/* Detail Pembayaran berdasarkan metode yang dipilih */}
        {paymentMethod && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gray-50 border rounded-lg p-4 space-y-3"
            >
                <h3 className="font-semibold text-gray-800">Pilih Bank untuk Virtual Account</h3>
                
                {/* Transfer Bank */}
                {paymentMethod === 'bank' && (
                    <div className="space-y-3">
                        <div className="bg-white rounded p-3 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bank:</span>
                                <span className="font-semibold">{paymentDetails.bank.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">No. Rekening:</span>
                                <span className="font-semibold font-mono">{paymentDetails.bank.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Atas Nama:</span>
                                <span className="font-semibold">{paymentDetails.bank.accountName}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                            ⚠️ {paymentDetails.bank.instructions}
                        </p>
                    </div>
                )}

                {/* QRIS */}
                {paymentMethod === 'qris' && (
                    <div className="space-y-3">
                        <div className="bg-white rounded p-4 flex flex-col items-center">
                            {/* Placeholder untuk QR Code - ganti dengan gambar asli */}
                            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded">
                                <div className="text-center">
                                    <p className="text-gray-500 mb-2">QR Code</p>
                                    <p className="text-xs text-gray-400">Scan untuk membayar</p>
                                </div>
                            </div>
                            {/* Jika Anda punya gambar QR:
                            <img 
                                src={paymentDetails.qris.qrImage} 
                                alt="QRIS Code" 
                                className="w-64 h-64"
                            />
                            */}
                        </div>
                        <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                            ℹ️ {paymentDetails.qris.instructions}
                        </p>
                    </div>
                )}

                {/* E-Wallet */}
                {paymentMethod === 'ewallet' && (
                    <div className="space-y-3">
                        <div className="bg-white rounded p-3 space-y-2">
                            {paymentDetails.ewallet.options.map((wallet, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                    <span className="font-medium">{wallet.name}</span>
                                    <span className="font-mono text-sm">{wallet.number}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                            ℹ️ {paymentDetails.ewallet.instructions}
                        </p>
                    </div>
                )}
            </motion.div>
        )}

        

        {/* Upload Bukti Transfer */}
        {paymentMethod && (
            <div>
                <label className="block text-sm font-medium mb-2">
                    Upload Bukti Transfer *
                </label>
                <input
                    type="file"
                    accept="image/*"
                    className="w-full border rounded p-2"
                    onChange={(e) => setProof(e.target.files ? e.target.files[0] : null)}
                />
                {proof && (
                    <p className="text-sm text-green-600 mt-1">
                        ✓ File terpilih: {proof.name}
                    </p>
                )}
            </div>
        )}

{/* Detail untuk Virtual Account */}
{paymentMethod === 'va' && (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="bg-gray-50 border rounded-lg p-4 space-y-4"
    >
        <h3 className="font-semibold text-gray-800">Pilih Bank untuk Virtual Account</h3>
        
        {/* Pilihan Bank */}
        <div className="grid grid-cols-2 gap-3">
            {bankVAOptions.map((bank) => (
                <button
                    key={bank.code}
                    onClick={() => handleBankSelect(bank.code)}
                    className={`p-4 border rounded-lg text-left hover:border-blue-500 transition-colors ${
                        selectedBank === bank.code ? 'border-blue-500 bg-blue-50' : 'bg-white'
                    }`}
                >
                    <div className="text-2xl mb-1">{bank.logo}</div>
                    <div className="font-medium">{bank.name}</div>
                </button>
            ))}
        </div>

        {/* Tampilkan VA setelah bank dipilih */}
        {virtualAccount && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-blue-500 rounded-lg p-4 space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">Nomor Virtual Account Anda</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Aktif 24 Jam
                    </span>
                </div>
                
                {/* Info Rekening Tujuan Owner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-blue-800 font-semibold">
                        <span className="text-xl">🏦</span>
                        <span>Rekening Tujuan Transfer</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                        <div className="text-gray-600">Bank:</div>
                        <div className="font-semibold">{bankVAOptions.find(b => b.code === selectedBank)?.name}</div>
                        
                        <div className="text-gray-600">No. Rekening:</div>
                        <div className="font-mono font-bold text-lg">
                            {bankVAOptions.find(b => b.code === selectedBank)?.ownerAccount}
                        </div>
                        
                        <div className="text-gray-600">Atas Nama:</div>
                        <div className="font-semibold">{bankVAOptions.find(b => b.code === selectedBank)?.ownerName}</div>
                    </div>
                </div>

                {/* Virtual Account Number */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="text-sm text-gray-600">
                        Gunakan Virtual Account ini sebagai referensi:
                    </div>
                    <div className="flex items-center justify-between bg-white border-2 border-dashed border-gray-300 rounded p-3">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Virtual Account Number</div>
                            <span className="text-xl font-mono font-bold text-gray-800">
                                {virtualAccount}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(virtualAccount);
                                showToast("Nomor VA disalin!");
                            }}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                            📋 Salin
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                        * Cantumkan nomor VA ini pada berita transfer atau keterangan
                    </p>
                </div>

                <div className="space-y-3 text-sm">
                    <p className="font-medium text-gray-800">📝 Cara Pembayaran:</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 bg-gray-50 rounded p-3">
                        <li>
                            Buka aplikasi mobile banking atau ATM <strong>{bankVAOptions.find(b => b.code === selectedBank)?.name}</strong>
                        </li>
                        <li>
                            Pilih menu <strong>Transfer ke Rekening {bankVAOptions.find(b => b.code === selectedBank)?.name}</strong>
                        </li>
                        <li>
                            Masukkan nomor rekening: <strong className="font-mono">{bankVAOptions.find(b => b.code === selectedBank)?.ownerAccount}</strong>
                        </li>
                        <li>
                            Nominal transfer: <span className="font-semibold text-blue-600">Rp {parseInt(price).toLocaleString('id-ID')}</span>
                        </li>
                        <li>
                            Pada <strong>Berita/Keterangan Transfer</strong>, masukkan: <strong className="font-mono">{virtualAccount}</strong>
                        </li>
                        <li>Konfirmasi dan selesaikan pembayaran</li>
                        <li>Simpan bukti transfer dan upload di bawah</li>
                    </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-0.5">⚠️</span>
                        <div className="flex-1 text-gray-700">
                            <strong>Penting:</strong>
                            <ul className="mt-1 space-y-1 text-xs">
                                <li>• Transfer ke rekening <strong>{bankVAOptions.find(b => b.code === selectedBank)?.name}</strong> di atas</li>
                                <li>• Jumlah transfer harus <strong>TEPAT Rp {parseInt(price).toLocaleString('id-ID')}</strong></li>
                                <li>• Wajib mencantumkan VA <strong>{virtualAccount}</strong> pada berita transfer</li>
                                <li>• VA berlaku selama <strong>24 jam</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
    </motion.div>
)}

        {/* Tombol Navigasi */}
        <div className="flex gap-3">
            <button
                onClick={prevStep}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                ← Kembali
            </button>
            <button
                onClick={handlePayment}
                disabled={loading || !paymentMethod || !proof}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Processing..." : "Konfirmasi Pembayaran"}
            </button>
        </div>
    </motion.div>
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