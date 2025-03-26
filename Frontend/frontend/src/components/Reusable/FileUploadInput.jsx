import { useEffect } from "react";
import useFileStore from "../../stores/FileStore";

const FileUploadInput = () => {
  const {
    previewUrl,
    error,
    setSelectedFile,
    setPreviewUrl,
    setError,
    clearFile,
  } = useFileStore();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      clearFile();
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setError("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        {/* Preview Container */}
        {previewUrl && (
          <div className="relative w-32 h-32 rounded-full border-4 border-blue-100 overflow-hidden">
            <img
              src={previewUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* File Upload Input */}
        <label
          className={`
          group cursor-pointer
          w-full max-w-xs p-6 border-2 border-dashed rounded-xl
          transition-colors duration-200
          ${
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-blue-500 bg-gray-50"
          }
        `}
        >
          <div className="flex flex-col items-center gap-3">
            <svg
              className={`w-8 h-8 mb-2 transition-colors duration-200 
                ${
                  error
                    ? "text-red-500"
                    : "text-gray-400 group-hover:text-blue-500"
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div className="text-center">
              <p
                className={`text-sm font-medium transition-colors duration-200
                ${
                  error
                    ? "text-red-600"
                    : "text-gray-600 group-hover:text-blue-600"
                }`}
              >
                {error || "Click to upload or drag and drop"}
              </p>
              <p
                className={`text-xs transition-colors duration-200
                ${
                  error
                    ? "text-red-500"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              >
                PNG, JPG, JPEG (MAX. 5MB)
              </p>
            </div>
          </div>

          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
          />
        </label>
      </div>

      {/* Selected File Info */}
      {previewUrl && (
        <div className="text-center text-sm text-gray-600">
          <p>Selected file: {useFileStore.getState().selectedFile?.name}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploadInput;
