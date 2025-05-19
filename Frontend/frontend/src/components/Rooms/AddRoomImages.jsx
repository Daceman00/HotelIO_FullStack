import React, { useEffect, useRef } from "react";
import { useUpdateRoomPhotos } from "./useUpdateRoomPhotos";
import useFileStore from "../../stores/FileStore";
import ImageGrid from "../Reusable/ImageGrid";
import CreateButton from "../Reusable/CreateButton";
import CoverImageUpload from "../Reusable/ImageCover";
import {
  XMarkIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../Reusable/LoadingSpinner";

function AddRoomImages({ roomId, isOpen, onClose, opacity }) {
  const modalRef = useRef(null);
  const { updateRoomPhotos, isPending } = useUpdateRoomPhotos();
  const {
    galleryImages,
    addGalleryImages,
    clearGalleryImages,
    coverImage,
    coverPreviewUrl,
    setCoverImage,
    clearCoverImage,
  } = useFileStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleGalleryUpload = async () => {
    const formData = new FormData();
    galleryImages.forEach((file) => {
      formData.append("images", file.file);
    });

    try {
      await updateRoomPhotos({ roomId, formData });
      clearGalleryImages();
    } catch (error) {
      console.error("Gallery upload failed:", error);
    }
  };

  const handleCoverUpload = async () => {
    const formData = new FormData();
    formData.append("imageCover", coverImage);

    try {
      await updateRoomPhotos({ roomId, formData });
      clearCoverImage();
    } catch (error) {
      console.error("Cover upload failed:", error);
    }
  };

  const handleClose = () => {
    clearGalleryImages();
    clearCoverImage();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
        style={{
          backgroundColor: `rgba(15, 23, 42, ${(opacity / 100) * 0.7})`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[95vh] overflow-y-auto border border-gray-100 transform transition-all duration-300"
        >
          {isPending ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <LoadingSpinner />
              <p className="text-gray-500 font-medium animate-pulse">
                Processing images...
              </p>
            </div>
          ) : (
            <>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-[#dfa379]/10 to-indigo-50 rounded-t-3xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <PhotoIcon className="w-6 h-6 text-[#dfa379]" />
                    Manage Room Images
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload high-quality visuals to showcase your room
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Cover Image Section */}
                <div className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="inline-block w-2 h-8 bg-[#dfa379] rounded-full"></span>
                      Cover Image
                    </h3>
                    <p className="text-sm text-gray-500">
                      This will be the main image displayed. Recommended size:
                      2000x1333px
                    </p>
                  </div>
                  <CoverImageUpload
                    currentCover={coverPreviewUrl}
                    onFileSelected={setCoverImage}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleCoverUpload}
                      disabled={isPending || !coverImage}
                      className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                        !coverImage || isPending
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#dfa379] hover:bg-[#c98b62] text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isPending ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          Upload Cover
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Gallery Images Section */}
                <div className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="inline-block w-2 h-8 bg-[#dfa379] rounded-full"></span>
                      Gallery Images
                    </h3>
                    <p className="text-sm text-gray-500">
                      Add up to 5 additional images to showcase your room (max
                      5MB each)
                    </p>
                  </div>
                  <ImageGrid
                    images={galleryImages}
                    onFilesSelected={addGalleryImages}
                    multiple
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleGalleryUpload}
                      disabled={isPending || galleryImages.length === 0}
                      className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                        galleryImages.length === 0 || isPending
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#dfa379] hover:bg-[#c98b62] text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isPending ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          Upload Gallery
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Help Text */}
                <div className="px-4 py-3 bg-[#dfa379]/10 border border-[#dfa379]/20 rounded-xl text-sm text-[#95654d]">
                  <p>
                    Images will be processed and optimized automatically. For
                    best results, upload high resolution photos with good
                    lighting.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AddRoomImages;
