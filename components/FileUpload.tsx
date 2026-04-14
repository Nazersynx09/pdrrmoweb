"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, File, Trash2, Eye } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export default function FileUpload({ value, onChange, label, accept = ".pdf,.jpg,.jpeg,.png,.gif" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = value?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = value?.toLowerCase().endsWith('.pdf');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or image file (JPG, PNG, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onChange(result);
        setUploading(false);
      };
      reader.onerror = () => {
        setUploading(false);
        alert("Failed to read file");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      alert("Failed to upload file");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group">
          {isImage ? (
            <div className="relative h-40 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={value}
                alt="File preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">PDF Document</p>
                <p className="text-xs text-gray-500">Click to preview or download</p>
              </div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-[#002E5D] hover:bg-gray-200 rounded-lg"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </a>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleBrowseClick}
              className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
              title="Replace file"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`relative h-32 cursor-pointer rounded-lg border-2 border-dashed transition-all ${
            isDragging
              ? "border-[#F58220] bg-[#F58220]/5"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F58220]" />
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste file URL..."
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-gray-900 placeholder:text-gray-400 text-sm"
      />
    </div>
  );
}