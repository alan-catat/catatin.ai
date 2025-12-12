'use client';

import { useState } from 'react';

export default function Convert() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('excel');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Baca file sebagai base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileData: base64, format }),
        });

        if (format === 'excel') {
          // Download file langsung
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'converted.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          // Redirect ke Google link
          const result = await res.json();
          if (result.url) {
            window.open(result.url, '_blank');
          } else {
            alert('Error: ' + result.error);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error: ' + "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">PDF Converter</h1>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="mt-4 block w-full p-2 border rounded"
        >
          <option value="excel">Excel</option>
          <option value="sheets">Google Sheets</option>
          <option value="docs">Google Docs</option>
        </select>
        <button
          onClick={convert}
          disabled={!file || loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
      </div>
    </div>
  );
}