import React from "react";
import { useUpdateRoomPhotos } from "./useUpdateRoomPhotos";
import useFileStore from "../../stores/FileStore";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import ImageGrid from "../Reusable/ImageGrid";
import CreateButton from "../Reusable/CreateButton";
import CoverImageUpload from "../Reusable/ImageCover";

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

  return (
    <>
      <Loading mode={modes.all} />
      <div className="space-y-8">
        {/* Gallery Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Gallery Images</h2>
          <ImageGrid
            images={galleryImages}
            onFilesSelected={(files) => {
              addGalleryImages(files);
            }}
            multiple
          />
          <CreateButton
            onClick={handleGalleryUpload}
            disabled={isPending || galleryImages.length === 0}
            className="mt-4"
          >
            {isPending ? "Uploading..." : "Upload Gallery Images"}
          </CreateButton>
        </div>

        {/* Cover Image Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Cover Image</h2>
          <CoverImageUpload
            currentCover={coverPreviewUrl}
            onFileSelected={(file) => {
              setCoverImage(file);
            }}
          />
          <CreateButton
            title="Update"
            color="primary"
            onClick={handleCoverUpload}
            disabled={isPending || !coverImage}
            className="mt-4"
          >
            {isPending ? "Uploading..." : "Upload Cover Image"}
          </CreateButton>
        </div>
      </div>
    </>
  );
}

export default AddRoomImages;
