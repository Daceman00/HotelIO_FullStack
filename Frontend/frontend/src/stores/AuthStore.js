import { create } from "zustand";

const useAuthStore = create((set) => ({
    // Initialize isAdmin from localStorage
    isAdmin: localStorage.getItem('isAdmin') === 'true',

    // Set role and store it in localStorage
    setRole: (role) => {
        const isAdmin = role === 'admin';
        set({ isAdmin });
        localStorage.setItem('isAdmin', isAdmin); // Save to localStorage
    },
}));

export default useAuthStore