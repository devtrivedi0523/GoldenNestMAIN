// src/components/ImageUploader.jsx
// Uploads images directly from browser to Cloudinary (unsigned preset)
// Returns public URLs — no backend needed for the upload itself.

import React, { useRef, useState } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const CLOUD_NAME = "dum08cr4m";
const UPLOAD_PRESET = "goldennest_unsigned";

const ImageUploader = ({ urls, onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "goldennest/properties");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
    const data = await res.json();
    return data.secure_url;
  };

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");

    try {
      const newUrls = await Promise.all(
        Array.from(files).map((f) => uploadToCloudinary(f))
      );
      onChange([...urls, ...newUrls]);
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeUrl = (index) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#F3B03E] hover:bg-[#fffaf0] transition"
      >
        <FaCloudUploadAlt className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-700">
          {uploading ? "Uploading…" : "Click or drag & drop images here"}
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP — multiple files supported</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}

      {/* Preview grid */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden border bg-gray-100 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeUrl(i); }}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <FaTimes className="text-[9px]" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-black/50 text-white py-0.5">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Manual URL input as fallback */}
      <details className="text-xs text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">Or paste image URLs manually</summary>
        <input
          type="text"
          className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
          placeholder="https://image1.jpg, https://image2.jpg"
          onBlur={(e) => {
            const pasted = e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            if (pasted.length) {
              onChange([...urls, ...pasted]);
              e.target.value = "";
            }
          }}
        />
      </details>
    </div>
  );
};

export default ImageUploader;