import { create } from "zustand";

const useFileStore = create((set) => ({
    selectedFile: null,
    previewUrl: null,
    error: null,
    setSelectedFile: (file) => set({ selectedFile: file, error: null }),
    setPreviewUrl: (url) => set({ previewUrl: url }),
    setError: (error) => set({ error }),
    clearFile: () => set({ selectedFile: null, previewUrl: null, error: null }),
}));

export default useFileStore;