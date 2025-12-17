'use client';

import { useState } from 'react';
import { FileText, Upload, Download, Shield, Cloud, ArrowRight } from 'lucide-react';

export default function Convert() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('excel');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);

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
    { icon: FileText, title: 'Convert Any File', description: 'Support for all major file formats' },
    { icon: Cloud, title: 'Works Anywhere', description: 'No installation required' },
    { icon: Shield, title: 'Privacy Guaranteed', description: 'Your files are secure' },
  ];

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
          <nav className="hidden md:flex space-x-6">
            <button className="text-gray-600 hover:text-gray-900">Convert</button>
            <button className="text-gray-600 hover:text-gray-900">Compress</button>
            <button className="text-gray-600 hover:text-gray-900">Tools</button>
            <button className="text-gray-600 hover:text-gray-900">API</button>
            <button className="text-gray-600 hover:text-gray-900">Pricing</button>
          </nav>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900">Log In</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">File Converter</h1>
          <p className="text-xl text-gray-600">
            Easily convert files from one format to another, online.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <span className="text-gray-700 font-medium">{action.label}</span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
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
                    📄 Choose Files
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-4 text-sm text-gray-500">
                  Max file size 1GB. <span className="text-indigo-600 cursor-pointer">Sign Up</span> for more
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  By proceeding, you agree to our <span className="text-indigo-600 cursor-pointer">Terms of Use</span>
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
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Convert to:
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
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Convert Now</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {bottomActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <span className="text-gray-700 font-medium">{action.label}</span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            
            <div>© catatin.ai · All rights reserved (2025)</div>
          </div>
        </div>
      </footer>
    </div>
  );
}