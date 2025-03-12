import React from "react";
import { useUpdateRoomPhotos } from "./useUpdateRoomPhotos";
import useFileStore from "../../stores/FileStore";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import ImageGrid from "../Reusable/ImageGrid";
import CreateButton from "../Reusable/CreateButton";
import CoverImageUpload from "../Reusable/ImageCover";
import { XMarkIcon } from "@heroicons/react/24/outline";

function AddRoomImages({ roomId }) {
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
      <Loading mode={modes.all} />
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold">Manage Room Images</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-8">
            <Loading mode={modes.all} />

            {/* Cover Image Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cover Image</h3>
              <CoverImageUpload
                currentCover={coverPreviewUrl}
                onFileSelected={setCoverImage}
              />
              <div className="flex justify-end">
                <CreateButton
                  onClick={handleCoverUpload}
                  disabled={isPending || !coverImage}
                  variant="primary"
                  size="md"
                >
                  {isPending ? "Uploading..." : "Upload Cover"}
                </CreateButton>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-t border-gray-200" />

            {/* Gallery Images Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Gallery Images</h3>
              <ImageGrid
                images={galleryImages}
                onFilesSelected={addGalleryImages}
                multiple
              />
              <div className="flex justify-end">
                <CreateButton
                  onClick={handleGalleryUpload}
                  disabled={isPending || galleryImages.length === 0}
                  variant="primary"
                  size="md"
                >
                  {isPending ? "Uploading..." : "Upload Gallery"}
                </CreateButton>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t flex justify-end gap-4">
            <CreateButton onClick={handleClose} variant="secondary" size="md">
              Close
            </CreateButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddRoomImages;
