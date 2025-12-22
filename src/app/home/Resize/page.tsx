"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

export default function LogoResizer() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resizeImage(img);
      };
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  const resizeImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const targetWidth = 240;
    const targetHeight = 72;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    const x = (targetWidth - scaledWidth) / 2;
    const y = (targetHeight - scaledHeight) / 2;
    
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    canvas.toBlob((blob) => {
      if (blob) {
        setProcessedBlob(blob);
        setFileSize(blob.size);
        setPreview(canvas.toDataURL('image/png'));
      }
    }, 'image/png', 0.9);
  };

  const handleDownload = () => {
    if (processedBlob) {
      const url = URL.createObjectURL(processedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logo-resized.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const sizeKB = (fileSize / 1024).toFixed(2);
  const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  const isOverSize = fileSize > 1024 * 1024;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '600px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    subtitle: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '30px'
    },
    requirements: {
      background: '#f8f9fa',
      borderLeft: '4px solid #667eea',
      padding: '15px',
      marginBottom: '30px',
      borderRadius: '5px'
    },
    requirementsTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px'
    },
    requirementsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      fontSize: '13px',
      color: '#555'
    },
    requirementItem: {
      padding: '3px 0'
    },
    uploadArea: {
      border: isDragging ? '3px dashed #667eea' : '3px dashed #ddd',
      borderRadius: '10px',
      padding: '40px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginBottom: '20px',
      background: isDragging ? '#e7e9fc' : 'transparent'
    },
    uploadIcon: {
      fontSize: '48px',
      marginBottom: '10px'
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      width: '100%',
      marginTop: '10px',
      transition: 'transform 0.2s'
    },
    previewBox: {
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '30px',
      marginBottom: '20px'
    },
    previewTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '15px',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px'
    },
    previewCanvas: {
      border: '2px solid #ddd',
      borderRadius: '8px',
      background: 'white',
      padding: '10px'
    },
    info: {
      background: isOverSize ? '#fff3cd' : '#d3f9d8',
      borderLeft: isOverSize ? '4px solid #ffc107' : '4px solid #2f9e44',
      padding: '15px',
      marginTop: '20px',
      marginBottom: '20px',
      borderRadius: '5px',
      fontSize: '13px',
      color: isOverSize ? '#856404' : '#2f9e44'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎨 Logo Resizer</h1>
        <p style={styles.subtitle}>Resize logo Anda dengan mudah</p>
        
        <div style={styles.requirements}>
          <h3 style={styles.requirementsTitle}>Spesifikasi:</h3>
          <ul style={styles.requirementsList}>
            <li style={styles.requirementItem}>✓ Format: PNG</li>
            <li style={styles.requirementItem}>✓ Ukuran maksimal: 1 MB</li>
            <li style={styles.requirementItem}>✓ Dimensi: 240 x 72 pixels</li>
          </ul>
        </div>
        
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={styles.uploadArea}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = '#f8f9fa';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <div style={styles.uploadIcon}>📤</div>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Klik untuk upload atau drag & drop logo di sini
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>PNG, JPG, atau JPEG</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {preview && (
          <div>
            <div style={styles.previewBox}>
              <h3 style={styles.previewTitle}>Preview</h3>
              <div style={{ textAlign: 'center' }}>
                <canvas ref={canvasRef} style={styles.previewCanvas} />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                  240 x 72 pixels
                </p>
              </div>
            </div>
            
            <div style={styles.info}>
              {isOverSize ? (
                <>
                  <p>⚠️ Ukuran file: {sizeKB} KB ({sizeMB} MB)</p>
                  <p>Melebihi 1 MB, tapi biasanya masih bisa diterima</p>
                </>
              ) : (
                <p>✅ Ukuran file: {sizeKB} KB ({sizeMB} MB)</p>
              )}
              <p>Dimensi: 240 x 72 pixels</p>
              <p>Format: PNG</p>
            </div>
            
            <button
              onClick={handleDownload}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📥 Download Logo (PNG)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}