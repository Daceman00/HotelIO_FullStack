import { create } from "zustand";

const useAuthStore = create((set) => ({
    // Initialize isAdmin from localStorage
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    isUserLoggedIn: !!localStorage.getItem('token'),

    // Set role and store it in localStorage
    setRole: (role) => {
        const isAdmin = role === 'admin'
        localStorage.setItem('isAdmin', isAdmin); // Save to localStorage
        set({ isAdmin });
    },

    // Set user login status
    setUserLoggedIn: (status) => set({ isUserLoggedIn: status }),

    // Centralized logout logic
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        set({ isUserLoggedIn: false, isAdmin: false });
    },

    updatePhotoData: (formData) => {
        set({ photoData: formData });
    },
}));

export default useAuthStore;