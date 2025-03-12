import { create } from "zustand";

const useFileStore = create((set) => ({
    selectedFile: null,
    previewUrl: null,
    error: null,
    setSelectedFile: (file) => set({ selectedFile: file, error: null }),
    setPreviewUrl: (url) => set({ previewUrl: url }),
    setError: (error) => set({ error }),
    clearFile: () => set({ selectedFile: null, previewUrl: null, error: null }),

    // Gallery images (multiple)
    galleryImages: [],
    addGalleryImages: (files) => {
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36).substr(2, 9)
        }));
        set(state => ({ galleryImages: [...state.galleryImages, ...newImages] }));
    },
    clearGalleryImages: () => set({ galleryImages: [] }),

    // Cover image (single)
    coverImage: null,
    coverPreviewUrl: null,
    coverError: null,
    setCoverImage: (file) => set({ coverImage: file, coverError: null }),
    setCoverPreviewUrl: (url) => set({ coverPreviewUrl: url }),
    setCoverError: (error) => set({ coverError: error }),
    clearCoverImage: () => set({ coverImage: null, coverPreviewUrl: null, coverError: null })
}));

export default useFileStore;