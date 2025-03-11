import React from "react";
import FileUploadInput from "../Reusable/FileUploadInput";

// Update with actual path
import toast from "react-hot-toast";
import useFileStore from "../../stores/FileStore";
import { useUpdateRoomPhotos } from "./useUpdateRoomPhotos";
import CreateButton from "../Reusable/CreateButton";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

function AddRoomImages({ roomId }) {
  // Add roomId prop
  const { updateRoomPhotos, isPending } = useUpdateRoomPhotos();
  const { previewUrl, selectedFile, clearFile } = useFileStore();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("images", selectedFile); // Use key your backend expects

    try {
      await updateRoomPhotos(roomId, formData);
      clearFile();
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  return (
    <>
      <Loading mode={modes.all} />
      <div className="space-y-4">
        <FileUploadInput />

        {previewUrl && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Preview:</h3>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-[200px] rounded-lg"
            />
          </div>
        )}

        <CreateButton onClick={handleUpload} title="Update">
          {isPending ? "Uploading..." : "Upload Image"}
        </CreateButton>
      </div>
    </>
  );
}

export default AddRoomImages;
