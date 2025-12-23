"use client";

import { useState, useRef } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Fungsi untuk mengakses kamera
  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      
      // Tunggu sedikit lalu set video stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error("Error mengakses kamera:", error);
      alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.");
      setIsCameraOpen(false);
    }
  };

  // Fungsi untuk mengambil foto
  const handleTakePhoto = () => {
    console.log("Mengambil foto...");
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      console.log("Video dimensions:", video.videoWidth, video.videoHeight);
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert("Video belum siap. Tunggu sebentar dan coba lagi.");
        return;
      }
      
      const context = canvas.getContext("2d");
      if (!context) {
        alert("Tidak dapat membuat canvas context");
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const base64Image = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
      console.log("Foto berhasil diambil, ukuran base64:", base64Image.length);
      setImageBase64(base64Image);
      
      // Tutup kamera setelah foto diambil
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
    } else {
      console.error("Video ref atau canvas ref tidak tersedia");
      alert("Kamera belum siap. Coba buka kamera lagi.");
    }
  };

  // Fungsi untuk menutup kamera tanpa mengambil foto
  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error mengakses mikrofon:", error);
      alert("Tidak dapat mengakses mikrofon. Pastikan Anda memberikan izin.");
    }
  };

  // Fungsi untuk menghentikan rekaman
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Fungsi untuk mengonversi audio ke base64
  const audioBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBCHAT_URL;

    if (!webhookUrl) {
      console.error("❌ Webhook URL tidak ditemukan di .env.local");
      setOutput("Konfigurasi webhook belum diset di server.");
      return;
    }

    const userEmail =
      localStorage.getItem("user_email") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.email;

    if (!userEmail) {
      alert("Email pengguna tidak ditemukan.");
      return;
    }

    try {
      const payload: {
        prompt: string;
        email: string;
        image?: string;
        audio?: string;
      } = {
        prompt: input,
        email: userEmail,
      };

      // Tambahkan gambar jika ada
      if (imageBase64) {
        payload.image = imageBase64;
      }

      // Tambahkan audio jika ada
      if (audioBlob) {
        const audioBase64 = await audioBlobToBase64(audioBlob);
        payload.audio = audioBase64;
      }

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response dari webhook:", data);

      const message =
        typeof data.message === "string"
          ? data.message
          : data.message?.content ||
            JSON.stringify(data.message, null, 2) ||
            "Tidak ada pesan dari server.";

      setOutput(message);
    } catch (error) {
      console.error("Fetch error:", error);
      setOutput("Terjadi kesalahan saat menghubungi server.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-[600px] flex flex-col items-center">
        {/* Header */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent tracking-wide">
          catatin.ai
        </h1>
        <h2 className="text-2xl font-bold bg-gradient-to-r mb-6 from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
          Agent
        </h2>

        {/* Jika kamera terbuka, sembunyikan textarea */}
        {!isCameraOpen && (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pertanyaanmu di sini..."
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded-lg p-4 w-full max-w-[500px] h-[120px]"
          />
        )}

        {/* Video Preview untuk Kamera */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-[80vh] w-auto h-auto"
              onLoadedMetadata={() => {
                console.log("Video metadata loaded");
              }}
            />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
              <button
                onClick={handleTakePhoto}
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-blue-50 transition"
              >
                📸 Ambil Foto
              </button>
              <button
                onClick={handleCloseCamera}
                className="bg-red-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-red-600 transition"
              >
                ✕ Tutup
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Preview Foto yang sudah diambil */}
        {imageBase64 && !isCameraOpen && (
          <div className="mt-4 w-full max-w-[500px] relative">
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Captured"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={() => setImageBase64("")}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
            >
              Hapus
            </button>
          </div>
        )}

        {/* Audio Preview */}
        {audioBlob && !isCameraOpen && (
          <div className="mt-4 w-full max-w-[500px] flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <audio controls src={URL.createObjectURL(audioBlob)} className="flex-1" />
            <button
              onClick={() => setAudioBlob(null)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
            >
              Hapus
            </button>
          </div>
        )}

        {/* Tombol-tombol kontrol - hanya tampil jika kamera tidak terbuka */}
        {!isCameraOpen && (
          <div className="mt-4 flex gap-2 flex-wrap justify-center w-full max-w-[500px]">
            {!imageBase64 && (
              <button
                onClick={handleOpenCamera}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
              >
                📷 Buka Kamera
              </button>
            )}

            {!isRecording && !audioBlob && (
              <button
                onClick={handleStartRecording}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow"
              >
                🎤 Rekam Suara
              </button>
            )}

            {isRecording && (
              <button
                onClick={handleStopRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow animate-pulse"
              >
                ⏹️ Stop Rekaman
              </button>
            )}
          </div>
        )}

        {!isCameraOpen && (
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition text-white px-5 py-3 rounded-xl text-lg shadow w-full max-w-[200px]"
          >
            Kirim
          </button>
        )}

        {!isCameraOpen && (
          <div className="animate-fade-in">
            {output && (
              <div className="animate-fade-in mt-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl text-gray-800 dark:text-gray-200 w-full max-w-[500px] text-base sm:text-lg whitespace-pre-wrap shadow-md">
                <strong className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                  Jawaban AI:
                </strong>
                <p>{output}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}