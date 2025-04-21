import React, { useEffect } from "react";
import { useUpdateRoomPhotos } from "./useUpdateRoomPhotos";
import useFileStore from "../../stores/FileStore";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import ImageGrid from "../Reusable/ImageGrid";
import CreateButton from "../Reusable/CreateButton";
import CoverImageUpload from "../Reusable/ImageCover";
import { XMarkIcon } from "@heroicons/react/24/outline";

function AddRoomImages({ roomId, isOpen, onClose, opacity }) {
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        style={{
          backgroundColor: `rgba(15, 23, 42, ${(opacity / 100) * 0.7})`,
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[95vh] overflow-y-auto border border-gray-100 transform transition-all">
          {isPending ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loading mode="half" />
            </div>
          ) : (
            <>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Manage Room Images
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload or update room visuals
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                {/* Cover Image Section */}
                <div className="space-y-4 md:space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cover Image
                    </h3>
                    <p className="text-sm text-gray-500">
                      Recommended size: 2000x1333px
                    </p>
                  </div>
                  <CoverImageUpload
                    currentCover={coverPreviewUrl}
                    onFileSelected={setCoverImage}
                  />
                  <div className="flex justify-end">
                    <CreateButton
                      onClick={handleCoverUpload}
                      disabled={isPending || !coverImage}
                      color={"primary"}
                    >
                      {isPending ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        "Upload Cover"
                      )}
                    </CreateButton>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-400">
                      Additional Images
                    </span>
                  </div>
                </div>

                {/* Gallery Images Section */}
                <div className="space-y-4 md:space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Gallery Images
                    </h3>
                    <p className="text-sm text-gray-500">
                      Maximum 5 images (up to 5MB each)
                    </p>
                  </div>
                  <ImageGrid
                    images={galleryImages}
                    onFilesSelected={addGalleryImages}
                    multiple
                  />
                  <div className="flex justify-end gap-3">
                    <CreateButton
                      onClick={handleGalleryUpload}
                      disabled={isPending || galleryImages.length === 0}
                      color={"primary"}
                    >
                      {isPending ? "Uploading..." : "Upload Gallery"}
                    </CreateButton>
                  </div>
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
