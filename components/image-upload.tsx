"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
  gradient?: string;
}

// Helper function to detect mobile devices
const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
};

export const ImageUpload = ({ 
  onImageUpload, 
  gradient = "from-cyan-400 via-blue-500 to-indigo-600" 
}: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Check for mobile device and camera support on mount
  useEffect(() => {
    const checkMobile = isMobileDevice();
    setIsMobile(checkMobile);
    
    // Check if camera API is supported
    const checkCameraSupport = async () => {
      try {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          setCameraSupported(true);
        } else {
          setCameraSupported(false);
        }
      } catch (error) {
        setCameraSupported(false);
      }
    };
    
    checkCameraSupport();
  }, []);

  const handleImageSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setSelectedImage(file);
    onImageUpload(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  }, [handleImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageSelect(files[0]);
    }
  }, [handleImageSelect]);

  const handleCameraInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageSelect(files[0]);
    }
  }, [handleImageSelect]);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  }, [onImageUpload]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCameraClick = useCallback(async () => {
    try {
      if (isMobile && cameraSupported) {
        cameraInputRef.current?.click();
      } else {
        // Fallback to regular file input for desktop or unsupported devices
        fileInputRef.current?.click();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Unable to access camera. Using file picker instead.');
      fileInputRef.current?.click();
    }
  }, [isMobile, cameraSupported]);

  const handleCameraKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCameraClick();
    }
  }, [handleCameraClick]);

  if (imagePreview) {
    return (
      <div className="relative group">
        <div className="relative w-full h-8 rounded-lg overflow-hidden border-2 border-gray-200">
          <Image
            src={imagePreview}
            alt="Selected image"
            fill
            className="object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 p-0.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200"
          >
            <X size={8} />
          </button>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 text-[10px] text-center text-gray-500 bg-white/80 rounded-b-lg py-0.5">
          {selectedImage?.name}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative w-full h-8 border-2 border-dashed rounded-lg
        transition-all duration-200
        ${isDragOver 
          ? `border-amber-400 bg-gradient-to-r ${gradient} bg-opacity-5` 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Regular file input for gallery/file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        aria-label="Choose image from files"
      />
      
      {/* Camera input for mobile camera capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraInput}
        className="hidden"
        aria-label="Take photo with camera"
      />
      
      <div className="flex items-center justify-between h-full px-2">
        {/* Left side - Upload area */}
        <div 
          className="flex items-center gap-1 cursor-pointer flex-1"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label="Click to upload image from files"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <div className={`flex items-center gap-1 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            <ImageIcon size={12} />
            <Upload size={10} />
          </div>
          <div className="text-[10px] text-gray-500">
            <span className="hidden md:inline">Drop or </span>
            <span className="font-medium">upload</span>
          </div>
        </div>
        
        {/* Right side - Camera icon */}
        <div 
          className={`
            flex items-center justify-center w-6 h-6 rounded cursor-pointer
            transition-all duration-200 hover:scale-110 focus:scale-110
            ${cameraSupported 
              ? `bg-gradient-to-r ${gradient} bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20` 
              : 'bg-gray-100 opacity-50 cursor-not-allowed'
            }
          `}
          onClick={cameraSupported ? handleCameraClick : undefined}
          onKeyDown={cameraSupported ? handleCameraKeyDown : undefined}
          role="button"
          tabIndex={cameraSupported ? 0 : -1}
          aria-label={
            isMobile && cameraSupported 
              ? "Take photo with camera" 
              : cameraSupported 
              ? "Choose image from files or camera" 
              : "Camera not supported"
          }
          title={
            isMobile && cameraSupported 
              ? "Take photo with camera" 
              : cameraSupported 
              ? "Choose image" 
              : "Camera not supported"
          }
        >
          <Camera 
            size={12} 
            className={`${cameraSupported 
              ? `bg-gradient-to-r ${gradient} bg-clip-text text-transparent` 
              : 'text-gray-400'
            }`} 
          />
        </div>
      </div>
    </div>
  );
};
