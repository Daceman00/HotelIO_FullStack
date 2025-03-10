import React from "react";
import FileUploadInput from "../Reusable/FileUploadInput";
import { useUpdateRoomPhotos } from "./useUpdateRoomPhotos";

function AddRoomImages() {
  const { updateRoomPhotos, isPending, error } = useUpdateRoomPhotos();
  const { previewUrl, selectedFile } = useFileStore();
  return <FileUploadInput />;
}

export default AddRoomImages;
