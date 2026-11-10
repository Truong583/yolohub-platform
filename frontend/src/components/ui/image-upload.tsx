"use client";

import * as React from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdCloudUpload, MdDelete, MdImage, MdFileUpload } from "react-icons/md";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onError,
  disabled = false,
  label = "Image",
  placeholder = "Enter image URL or upload a file",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadMode, setUploadMode] = React.useState<"url" | "upload" | "file">(
    "url"
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError?.("Please select an image file");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      // 4MB limit
      onError?.("File size must be less than 4MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for preview (temporary solution)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        onError?.("Failed to read file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      onError?.("Failed to process file");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("url")}
            disabled={disabled}
          >
            URL
          </Button>
          <Button
            type="button"
            variant={uploadMode === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("upload")}
            disabled={disabled}
          >
            <MdCloudUpload className="h-4 w-4 mr-1" />
            UploadThing
          </Button>
          <Button
            type="button"
            variant={uploadMode === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("file")}
            disabled={disabled}
          >
            <MdFileUpload className="h-4 w-4 mr-1" />
            File
          </Button>
        </div>
      </div>

      {uploadMode === "url" ? (
        <div className="space-y-3">
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          {value && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                <MdImage className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 truncate flex-1">
                  {value}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange("")}
                  disabled={disabled}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <MdDelete className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative w-full max-w-sm mx-auto">
                <Image
                  src={value}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover border w-full"
                  onError={() => onError?.("Failed to load image")}
                />
              </div>
            </div>
          )}
        </div>
      ) : uploadMode === "upload" ? (
        <div className="space-y-3">
          {!value ? (
            <div className="space-y-2">
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Upload completed:", res);
                  if (res?.[0]) {
                    console.log("Setting image URL:", res[0].url);
                    onChange(res[0].url);
                    setIsUploading(false);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error);
                  onError?.(error.message);
                  setIsUploading(false);
                }}
                onUploadBegin={() => {
                  console.log("Upload started");
                  setIsUploading(true);
                }}
                disabled={disabled || isUploading}
                config={{ mode: "auto" }}
              />
              {isUploading && (
                <div className="text-center text-sm text-blue-600">
                  Uploading image...
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative w-full max-w-sm mx-auto">
                <Image
                  src={value}
                  alt="Uploaded image"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover border w-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onChange("")}
                  disabled={disabled}
                  className="absolute top-2 right-2"
                >
                  <MdDelete className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onChange("")}
                disabled={disabled}
                className="w-full"
              >
                Upload Different Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
          />

          {!value ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <MdFileUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                {isUploading
                  ? "Processing..."
                  : "Click to select an image file"}
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG, GIF up to 4MB
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative w-full max-w-sm mx-auto">
                <Image
                  src={value}
                  alt="Selected image"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover border w-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onChange("")}
                  disabled={disabled}
                  className="absolute top-2 right-2"
                >
                  <MdDelete className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="w-full"
              >
                Select Different Image
              </Button>
            </div>
          )}

          {isUploading && (
            <div className="text-center text-sm text-blue-600">
              Processing image...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
