'use client';

import { useEffect, useState } from 'react';
import { FileText, Upload, Download, Shield, Cloud, ArrowRight, Award, Star, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function Convert() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('excel');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
const [compressionLevel, setCompressionLevel] = useState('no-compression');
const [password, setPassword] = useState('');
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setPreviewUrl(URL.createObjectURL(droppedFile));
  }
};

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
formData.append('file', file);
formData.append('format', format);
formData.append('compressionLevel', compressionLevel);  // ← BARU
if (password) {
  formData.append('password', password);  // ← BARU
}

      // Ganti dengan URL webhook n8n Anda
      const n8nWebhookUrl = 'https://your-n8n-instance.com/webhook/pdf-converter';
      
      const res = await fetch(n8nWebhookUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      
      if (result.downloadUrl) {
        // Download file yang sudah dikonversi
        window.open(result.downloadUrl, '_blank');
      } else if (result.error) {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error converting file. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  const quickActions = [
    { label: 'Compress PDFs to 2MB', icon: ArrowRight },
    { label: 'Convert Audio to Mp3', icon: ArrowRight },
    { label: 'Compress Video To 10MB', icon: ArrowRight },
    { label: 'convert to JPEG free', icon: ArrowRight },
  ];

  const bottomActions = [
    { label: 'Transcribe Audio to Text', icon: ArrowRight },
    { label: 'Convert File to PDF', icon: ArrowRight },
    { label: 'Convert Audio to Mp3', icon: ArrowRight },
    { label: 'Humanize Your Text', icon: ArrowRight },
  ];

  const features = [
  { 
    icon: Award,  // ← GANTI dari FileText
    title: 'Best Quality',
    description: 'Perform high-quality PDF conversions by adjusting page size, margins, and orientation. Plus, you can also batch convert PDF files.'
  },
  { 
    icon: Star,  // ← GANTI dari Cloud
    title: 'All-In-One Tool',
    description: 'Supports more than 300+ PDF conversions. Convert any file to PDF or convert from PDF to other formats. All using a single web tool!'
  },
  { 
    icon: Shield, 
    title: 'Free & Secure',
    description: 'This PDF converter is free. It works on Windows, Mac, Linux, Chrome, Edge, Firefox... pretty much any web browser. Plus, we upload files over a secure HTTPS connection and delete all files automatically after a few hours. So you can convert files without worrying about file security and privacy.'
  },
];

useEffect(() => {
  return () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };
}, [previewUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0566BD] to-[#A8E063] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
          catatin.ai
        </span>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href="/home"
                  className="text-2l text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  <b>← Kembali ke halaman utama</b>
                </Link>
              </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Convertin</h1>
          <p className="text-xl text-gray-600">
            Kami akan bantu kamu nyatet transaksi penting tanpa repot.
          </p>
        </div>

        {/* File Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    📄 Pilih File
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-4 text-sm text-gray-500">
                  Ukuran file maksimal 1GB. <span className="text-indigo-600 cursor-pointer">Daftar</span> untuk lebih banyak
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Dengan melanjutkan, Anda setuju dengan <span className="text-indigo-600 cursor-pointer">Ketentuan Penggunaan</span> kami
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="w-8 h-8 text-indigo-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
  onClick={() => {
    setFile(null);
    setPreviewUrl(null);
  }}
  className="text-sm text-red-600 hover:text-red-700"
>
  Hapus file
</button>
              </div>
            )}
          </div>
          {file && previewUrl && (
  <div className="mt-6">
    <h3 className="text-sm font-medium text-gray-700 mb-2">
      Preview Dokumen
    </h3>

    <div className="border rounded-lg overflow-hidden bg-gray-100 h-[400px]">
      <iframe
        src={previewUrl}
        className="w-full h-full"
        title="PDF Preview"
      />
    </div>

    <p className="text-xs text-gray-500 mt-2">
      * Ini hanya preview, hasil konversi bisa berbeda tergantung format tujuan.
    </p>
  </div>
)}

          {file && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konversi ke:
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="word">Word (.docx)</option>
                  <option value="sheets">Google Sheets</option>
                  <option value="docs">Google Docs</option>
                  <option value="ppt">PowerPoint (.pptx)</option>
                </select>
              </div>

              <button
                onClick={convert}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Mengkonversi...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Konversi Sekarang</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

       {/* Advanced Settings */}
              <div className="mt-6 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Pengaturan lanjutan (opsional)</span>
                  </div>
                  {showAdvanced ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="border-t border-gray-200 p-4 space-y-6">
                    {/* Compress Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Settings className="w-4 h-4 text-gray-600" />
                        <h3 className="font-medium text-gray-900">Kompres</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block">
                          <span className="text-sm font-medium text-gray-700 mb-2 block">
                            Tingkat kompresi
                          </span>
                          <select
                            value={compressionLevel}
                            onChange={(e) => setCompressionLevel(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                          >
                            <option value="no-compression">Tanpa Kompresi</option>
                            <option value="low">Rendah - Kompresi minimal, kualitas lebih tinggi</option>
                            <option value="medium">Sedang - Seimbang antara kualitas dan ukuran</option>
                            <option value="high">Tinggi - Kompresi maksimal, ukuran lebih kecil</option>
                          </select>
                        </label>
                        <p className="text-xs text-gray-500">
                          Pilih tingkat kompresi yang diinginkan: Tanpa Kompresi untuk kualitas asli, Tinggi untuk kompresi maksimal dan ukuran lebih kecil, Sedang untuk keseimbangan antara kualitas dan ukuran, atau Rendah untuk kompresi minimal dan kualitas lebih tinggi.
                        </p>
                      </div>
                    </div>

      {/* Document Options Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Opsi Dokumen</h3>
        </div>
        
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              Password (optional)
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              maxLength={255}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </label>
          <p className="text-xs text-gray-500">
            Kata sandi untuk membuka file sumber.
          </p>
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
          <span>Apply</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )}
</div>

{/* How to Convert Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cara Konversi ke PDF?</h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Klik tombol <span className="font-semibold">"Pilih File"</span> dan pilih file yang ingin Anda konversi.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Konversi ke PDF dengan mengklik tombol <span className="font-semibold">"Konversi"</span>.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Ketika status berubah menjadi "Selesai" klik tombol <span className="font-semibold">"Unduh PDF"</span>.</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            
            <div>© catatin.ai · All rights reserved (2025)</div>
          </div>
        </div>
      </footer>
    </div>
  );
}