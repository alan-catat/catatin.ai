'use client';

import { useEffect, useState } from 'react';
import { FileText, Upload, Download, Shield, Cloud, ArrowRight, Award, Star, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import ExcelJS from 'exceljs';
import Image from "next/image";


const N8N_CONVERTIN_URL = process.env.NEXT_PUBLIC_N8N_CONVERTIN_URL;

export default function ConvertClient() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('excel');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
const [compressionLevel, setCompressionLevel] = useState('no-compression');
const [password, setPassword] = useState('');
const [previewUrl, setPreviewUrl] = useState<string | null>(null);
const [progress, setProgress] = useState(0);


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
  if (!N8N_CONVERTIN_URL) return;

  setLoading(true);
  setProgress(0);

  let interval: ReturnType<typeof setInterval> | undefined;

  try {
    interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 500);

    const formData = new FormData();
    formData.append("data", file);
    formData.append("format", format);
    formData.append("compressionLevel", compressionLevel);
    if (password) formData.append("password", password);

    const res = await fetch(N8N_CONVERTIN_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Konversi gagal. Silakan coba lagi.');
    }

    setProgress(95);
    clearInterval(interval);

    // Coba parse sebagai JSON dulu
    let data;
    let isJson = false;
    
    try {
      const text = await res.text();
      data = JSON.parse(text);
      isJson = true;
      console.log('Response data:', data);
    } catch (e) {
      // Bukan JSON, anggap sebagai binary file
      isJson = false;
    }

    if (isJson && data) {
      // Cari array items dari berbagai kemungkinan struktur
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
      } else if (typeof data === 'object') {
        items = [data];
      }

      console.log('Items to convert:', items.length);

      if (items.length === 0) {
        throw new Error('Tidak ada data untuk dikonversi.');
      }

      // Convert JSON to Excel dengan styling menggunakan ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Transaksi');

      // Get headers dari item pertama
      const headers = Object.keys(items[0]);

      // Add header row dengan styling
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF000000' } // Background hitam
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' }, // Font putih
          bold: true
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      // Add data rows
      items.forEach((item: any) => {
        const row = worksheet.addRow(Object.values(item));
        
        // Format kolom jumlah dan saldo
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1].toLowerCase();
          
          // Format number untuk kolom jumlah dan saldo
          if (header === 'jumlah' || header === 'saldo') {
            const cellValue = cell.value as string;
            const value = parseFloat(String(cellValue).replace(/,/g, ''));
            if (!isNaN(value)) {
              cell.value = value;
              cell.numFmt = '#,##0'; // Format ribuan tanpa desimal
            }
          }
        });
      });

      // Auto-fit kolom width
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `convertinbycatatinai-${file.name.replace(/\.[^/.]+$/, '')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setProgress(100);
      showToast(`✅ Berhasil! ${items.length} transaksi telah dikonversi ke Excel`);
      
    } else {
      // Jika N8N mengembalikan file binary langsung
      const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = format === 'excel' ? 'xlsx' : format;
      link.download = `convertinbycatatinai-${file.name.replace(/\.[^/.]+$/, '')}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      setProgress(100);
      alert('✅ File berhasil dikonversi dan didownload!');
    }

  } catch (err) {
    if (interval) clearInterval(interval);
    console.error('Error:', err);
    alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat konversi. Silakan coba lagi.');
  } finally {
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 500);
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
    icon: Award,  
    title: 'Best Quality',
    description: 'Perform high-quality PDF conversions by adjusting page size, margins, and orientation. Plus, you can also batch convert PDF files.'
  },
  { 
    icon: Star, 
    title: 'All-In-One Tool',
    description: 'Supports more than 300+ PDF conversions. Convert any file to PDF or convert from PDF to other formats. All using a single web tool!'
  },
  { 
    icon: Shield, 
    title: 'Free & Secure',
    description: 'This PDF converter is free. It works on Windows, Mac, Linux, Chrome, Edge, Firefox... pretty much any web browser. Plus, we upload files over a secure HTTPS connection and delete all files automatically after a few hours. So you can convert files without worrying about file security and privacy.'
  },
];

const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  setToast({ show: true, message, type });
  setTimeout(() => {
    setToast({ show: false, message: '', type: 'success' });
  }, 3000);
};

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
            <span className="text-xl font-bold bg-[#066D97] bg-clip-text text-transparent">
          convertin
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">convertin</h1>
          <p className="text-xl text-gray-600">
            Tidak perlu input manual! PDF bank statement BCA langsung jadi Excel siap dianalisis.
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
                    📄 Upload File
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-4 text-sm text-gray-500">
                  Ukuran file maksimal 100MB. <span className="text-indigo-600 cursor-pointer">Daftar</span> untuk lebih banyak
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Dengan melanjutkan, Anda setuju dengan <Link href="/convertin/syarat-ketentuan"><span className="text-indigo-600 cursor-pointer">Ketentuan Penggunaan</span></Link> kami
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
                  
                </select>
              </div>

              <button
  disabled={loading}
  className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium text-lg transition-colors"
>
  {loading ? (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span>Mengkonversi...</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full bg-indigo-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  ) : (
    <div
      onClick={convert}
      className="flex items-center justify-center space-x-2 cursor-pointer"
    >
      <Download className="w-5 h-5" />
      <span>convertin Sekarang</span>
    </div>
  )}
</button>
            </div>
          )}
        </div>

       {/* Advanced Settings */}
              <div className="mt-6 rounded-lg border shadow-lg">
  <div className="w-full flex items-center justify-between p-4 bg-gray-300 shadow-lg">
    <div className="flex items-center space-x-2">
      <Settings className="w-5 h-5 text-gray-600" />
      <span className="font-medium text-gray-900">
        Pengaturan lanjutan (opsional)
      </span>
    </div>
  </div>

                
                  <div className="border-t border-gray-200 p-4 space-y-6 bg-white  shadow-lg">
                    

      {/* Document Options Section */}
      <div className="bg-white rounded-lg p-4">
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
              placeholder="Masukan password"
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
    </div></div>


{/* How to Convert Section */}<div className="mt-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cara Konversi</h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span><b>Upload file</b> PDF bank statement kamu</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Klik tombol <b>convertin Sekarang</b>.</span>
            
            </li>
          </ol>
        </div>
        </div>

        <div className="mt-8">
  <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">
      Contoh Hasil
    </h2>

    <div className="flex ">
      <Image
        src="/contoh-hasil.png"
        alt="Contoh Hasil"
        width={800}
        height={450}
        className="shadow-md"
      />
    </div>
  </div>
</div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            
            <div>© PT. Monivo Global Teknologi · All rights reserved (2025)</div>
          </div>
        </div>
      </footer>
    </div>
  );
}