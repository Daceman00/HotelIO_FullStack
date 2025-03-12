// components/ImageGrid.jsx
import React from "react";
import { TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import useFileStore from "../../stores/FileStore";

const ImageGrid = ({ multiple }) => {
  const { galleryImages, addGalleryImages } = useFileStore();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      addGalleryImages(files);
    }
  };

  const handleRemoveImage = (id) => {
    const updatedImages = galleryImages.filter((img) => img.id !== id);
    addGalleryImages(updatedImages);
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-gray-400 hover:text-blue-500">
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <PhotoIcon className="w-8 h-8 mb-2" />
        <span className="text-sm">Add Photos</span>
      </label>

      {galleryImages.map((image) => (
        <div key={image.id} className="relative group aspect-square">
          <img
            src={image.preview}
            alt={`Preview ${image.id}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(image.id)}
            className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <TrashIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
