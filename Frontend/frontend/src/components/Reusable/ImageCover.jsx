// components/CoverImageUpload.jsx
import React from "react";
import { TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import useFileStore from "../../stores/FileStore";

const CoverImageUpload = () => {
  const { coverImage, setCoverImage, clearCoverImage } = useFileStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="w-full max-w-md aspect-video flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-gray-400 hover:text-blue-500">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {coverImage ? (
          <div className="relative w-full h-full">
            <img
              src={coverImage.preview}
              alt="Cover preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="p-6 text-center">
            <PhotoIcon className="w-12 h-12 mx-auto mb-4" />
            <p className="text-sm">Click to upload cover image</p>
            <p className="text-xs text-gray-500 mt-1">
              Recommended ratio: 16:9
            </p>
          </div>
        )}
      </label>

      {coverImage && (
        <button
          type="button"
          onClick={clearCoverImage}
          className="mt-4 flex items-center text-sm text-red-600 hover:text-red-700"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Remove Cover
        </button>
      )}
    </div>
  );
};

export default CoverImageUpload;
