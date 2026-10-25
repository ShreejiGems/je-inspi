"use client";

import React, { useState, useEffect, useCallback } from "react";
import { uploadAPI, dynamicSectionAPI } from "@/src/services/api";
import { IMAGE_TYPE, IMAGE_TYPE_LABELS } from "@/src/libs/constants";
import {
  validateFile,
  getFileType,
  generateFileName,
  formatFileSize,
} from "@/src/utils/fileUtils";
import { LuRefreshCcw } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { BsCloudUpload } from "react-icons/bs";
import { IoVideocamOutline } from "react-icons/io5";
import { GiQueenCrown } from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";

interface MediaItem {
  id: string;
  image: string;
  imageType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadState {
  [key: string]: {
    isUploading: boolean;
    progress: number;
    error: string | null;
    uploadedUrl: string | null;
  };
}

const HomePageMedia = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadStates, setUploadStates] = useState<UploadState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Initialize upload states for all image types
  useEffect(() => {
    const initialStates: UploadState = {};
    Object.values(IMAGE_TYPE).forEach((type) => {
      initialStates[type] = {
        isUploading: false,
        progress: 0,
        error: null,
        uploadedUrl: null,
      };
    });
    setUploadStates(initialStates);
  }, []);

  // Fetch existing media items
  const fetchMediaItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await dynamicSectionAPI.getSectionImages();
      setMediaItems(items);
    } catch (error) {
      console.error("Error fetching media items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMediaItems();
  }, [fetchMediaItems]);

  // Get media item for specific type
  const getMediaItem = (imageType: string) => {
    return mediaItems.find((item) => item.imageType === imageType);
  };

  // Determine if URL is a video based on file extension
  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
    const urlLower = url.toLowerCase();
    return videoExtensions.some((ext) => urlLower.includes(ext));
  };

  // Determine if URL is an image based on file extension
  const isImageUrl = (url: string) => {
    if (!url) return false;
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    const urlLower = url.toLowerCase();
    return imageExtensions.some((ext) => urlLower.includes(ext));
  };

  
  // Handle file upload
  const handleFileUpload = async (file: File, imageType: string) => {
    if (!file) return;
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setUploadStates((prev) => ({
        ...prev,
        [imageType]: {
          isUploading: false,
          progress: 0,
          error: validation.error || "Invalid file",
          uploadedUrl: null,
        },
      }));
      return;
    }

    console.log("File type:", getFileType(file));

    const mediaType = getFileType(file) === "IMAGE" ? "IMAGE" : "VIDEO";
    
    // Update upload state
    setUploadStates((prev) => ({
      ...prev,
      [imageType]: {
        isUploading: true,
        progress: 0,
        error: null,
        uploadedUrl: null,
      },
    }));

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadStates((prev) => ({
          ...prev,
          [imageType]: {
            ...prev[imageType],
            progress: Math.min(prev[imageType].progress + 10, 90),
          },
        }));
      }, 200);

      // Determine file type and resource type
      const fileType = getFileType(file);
      const resourceType = imageType.includes("JEWELLERY")
        ? "JEWELLERY"
        : "DIAMOND";

      // Generate unique filename
      const fileName = generateFileName(file.name, imageType);

      // Get presigned URL
      const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(
        fileName,
        fileType,
        resourceType
      );

      // Upload to S3
      await uploadAPI.uploadToS3(preSignedUrl, file);

      // Create section image record
      const newMediaItem = await dynamicSectionAPI.createSectionImage(
        outPutUrl,
        imageType,
        mediaType
      );

      clearInterval(progressInterval);

      // Update states
      setUploadStates((prev) => ({
        ...prev,
        [imageType]: {
          isUploading: false,
          progress: 100,
          error: null,
          uploadedUrl: outPutUrl,
        },
      }));

      // Refresh media items
      await fetchMediaItems();
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStates((prev) => ({
        ...prev,
        [imageType]: {
          isUploading: false,
          progress: 0,
          error: error.message || "Upload failed",
          uploadedUrl: null,
        },
      }));
    }
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent, imageType: string) => {
    e.preventDefault();
    setDragOver(null);
    const files: any = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], imageType);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, imageType);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, imageType: string) => {
    e.preventDefault();
    setDragOver(imageType);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  // Handle delete media
  const handleDeleteMedia = async (imageType: string) => {
    const mediaItem = getMediaItem(imageType);
    if (!mediaItem) return;

    if (window.confirm("Are you sure you want to delete this media?")) {
      try {
        // Extract filename from URL
        const urlParts: any = mediaItem.image.split("/");
        const fileName = urlParts[urlParts.length - 1].split("?")[0];

        // Determine file type and resource type based on actual file extension
        const fileType = isVideoUrl(mediaItem.image) ? "VIDEO" : "IMAGE";
        const resourceType = imageType.includes("JEWELLERY")
          ? "JEWELLERY"
          : "DIAMOND";

        // Delete from S3
        await uploadAPI.deleteFile(fileName, fileType, resourceType);

        // Refresh media items
        await fetchMediaItems();

        // Reset upload state
        setUploadStates((prev) => ({
          ...prev,
          [imageType]: {
            isUploading: false,
            progress: 0,
            error: null,
            uploadedUrl: null,
          },
        }));
      } catch (error: any) {
        console.error("Delete error:", error);
        alert("Failed to delete media: " + (error.message || "Unknown error"));
      }
    }
  };

  // Render upload area
  const renderUploadArea = (
    imageType: string,
    label: string,
    isWide: boolean = false
  ) => {
    const uploadState = uploadStates[imageType];
    const mediaItem = getMediaItem(imageType);
    const hasMedia: any = mediaItem || uploadState?.uploadedUrl;
    const isDragOver = dragOver === imageType;

    return (
      <div className="flex flex-col space-y-3 w-full">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-brand-900">{label}</label>
          {/* {hasMedia?.status === "ENABLED" && (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                <FaCheck className="text-brand-800 mr-1"/>
                Active
              </span>
            </div>
          )} */}
        </div>

        <div className="relative group">
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ease-in-out
              ${
                hasMedia
                  ? "border-brand-300 bg-gradient-to-br from-brand-50 to-brand-50 shadow-lg"
                  : "border-brand-200 bg-white hover:border-brand-400 hover:bg-brand-50"
              }
              ${
                uploadState?.isUploading ? "opacity-75 pointer-events-none" : ""
              }
              ${
                isDragOver
                  ? "border-brand-500 bg-brand-100 scale-105 shadow-xl"
                  : ""
              }
              ${isWide ? "w-96 h-56" : "w-64 h-96"}
            `}
            onDrop={(e) => handleDrop(e, imageType)}
            onDragOver={(e) => handleDragOver(e, imageType)}
            onDragLeave={handleDragLeave}
            onClick={() =>
              !hasMedia && document.getElementById(`file-${imageType}`)?.click()
            }
          >
            {uploadState?.isUploading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center mb-3.5">
                    <span className="text-sm font-medium text-brand-600">
                      {uploadState.progress}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-brand-700 font-medium">
                  Uploading...
                </p>
                <p className="text-xs text-brand-600 mt-1">Please wait</p>
              </div>
            ) : hasMedia ? (
              <div className="flex flex-col items-center justify-center h-full">
                {mediaItem?.image && (
                  <div className="relative w-full h-full group">
                    {isVideoUrl(mediaItem.image) ? (
                      <video
                        src={mediaItem.image}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                        controls={false}
                        muted
                        autoPlay
                        loop
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={mediaItem.image}
                        alt={label}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    )}

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            document
                              .getElementById(`file-${imageType}`)
                              ?.click();
                          }}
                          className="p-3 bg-white text-brand-800 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer"
                          title="Replace"
                        >
                          <LuRefreshCcw className="text-brand-900" />
                        </button>
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(imageType);
                          }}
                          className="p-3 bg-white text-brand-800 rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                          title="Delete"
                        >
                          <AiOutlineDelete className="text-red"/>
                        </button> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <BsCloudUpload className="text-brand-700 text-[50px]" />
                </div>
                <p className="text-sm font-medium text-brand-800 mb-1">
                  Drop file here or click to upload
                </p>
                <p className="text-xs text-brand-600 text-center">
                  Supports images and videos
                </p>
              </div>
            )}

            {uploadState?.error && (
              <div className="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-300 rounded-lg p-2">
                <p className="text-xs text-red-700 font-medium">
                  {uploadState.error}
                </p>
              </div>
            )}
          </div>

          {/* {hasMedia && mediaItem && (
            <div className="mt-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
              <div className="flex items-center justify-between text-xs text-brand-700">
                <div className="flex items-center space-x-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${mediaItem.status === 'ENABLED' ? 'bg-brand-500' : 'bg-brand-500'}`}></span>
                  <span className="font-medium">{mediaItem.status}</span>
                </div>
                <span>Uploaded {new Date(mediaItem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )} */}
        </div>

        <input
          id={`file-${imageType}`}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, imageType)}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg h-[calc(100vh-126px)] w-full">
      <div className="mx-auto h-full w-full">
        {/* Header */}
        <div className="rounded-lg shadow-lg border border-brand-50 mb-8 h-full w-full">
          <div className="flex items-center justify-between px-6 py-2 border-b border-brand-50">
            <div>
              <h1 className="text-2xl font-semibold text-brand-900">
                Home Page Media
              </h1>
            </div>
            {isLoading && (
              <div className="flex items-center space-x-3 bg-brand-50 px-4 py-2 rounded-full">
                <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-brand-700">
                  Loading media...
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 h-[calc(100%-50px)] overflow-y-scroll scrollbar">
            <div className="space-y-12">
              {/* Video Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                    <IoVideocamOutline className="text-brand-600" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-900">
                    Hero Videos
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {renderUploadArea(
                    IMAGE_TYPE.HERO_DESKTOP,
                    IMAGE_TYPE_LABELS[IMAGE_TYPE.HERO_DESKTOP],
                    true
                  )}
                  {renderUploadArea(
                    IMAGE_TYPE.HERO_MOBILE,
                    IMAGE_TYPE_LABELS[IMAGE_TYPE.HERO_MOBILE],
                    false
                  )}
                </div>
              </div>

              {/* Jewellery Banner Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                    <GiQueenCrown className="text-brand-600" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-900">
                    Jewellery Banners
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {renderUploadArea(
                    IMAGE_TYPE.JEWELLERY_BANNER_DESKTOP,
                    IMAGE_TYPE_LABELS[IMAGE_TYPE.JEWELLERY_BANNER_DESKTOP],
                    true
                  )}
                  {renderUploadArea(
                    IMAGE_TYPE.JEWELLERY_BANNER_MOBILE,
                    IMAGE_TYPE_LABELS[IMAGE_TYPE.JEWELLERY_BANNER_MOBILE],
                    false
                  )}
                </div>
              </div>

              {/* Diamond Banner Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                    <IoDiamond className="text-brand-600" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-900">
                    Diamond Banners
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {renderUploadArea(
                    IMAGE_TYPE.DIAMOND_BANNER_DESKTOP,
                    IMAGE_TYPE_LABELS[IMAGE_TYPE.DIAMOND_BANNER_DESKTOP],
                    true
                  )}
                  {renderUploadArea(
                    IMAGE_TYPE.DIAMOND_BANNER_MOBILE,
                    IMAGE_TYPE_LABELS[IMAGE_TYPE.DIAMOND_BANNER_MOBILE],
                    false
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Jewellery Video Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                      <IoVideocamOutline className="text-brand-600" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-900">
                      Jewellery Video
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {renderUploadArea(
                      IMAGE_TYPE.JEWELLERY_VIDEO,
                      IMAGE_TYPE_LABELS[IMAGE_TYPE.JEWELLERY_VIDEO],
                      false
                    )}
                  </div>
                </div>

                {/* Diamond Video Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                      <IoVideocamOutline className="text-brand-600" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-900">
                      Diamond Video
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {renderUploadArea(
                      IMAGE_TYPE.DIAMOND_VIDEO,
                      IMAGE_TYPE_LABELS[IMAGE_TYPE.DIAMOND_VIDEO],
                      false
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {/* <div className="mt-12 p-6 bg-gradient-to-r from-brand-50 to-brand-50 rounded-2xl border border-brand-100">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-3">Upload Guidelines</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-800">
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Drag and drop files or click to select</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Images: JPG, PNG, GIF, WebP</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Videos: MP4, MOV, AVI, WebM</span>
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Max file size: 50MB</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Desktop: Landscape orientation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Mobile: Portrait orientation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageMedia;
