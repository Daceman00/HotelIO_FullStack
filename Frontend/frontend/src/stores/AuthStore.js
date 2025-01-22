import { create } from "zustand";

const useAuthStore = create((set) => ({
    // Initialize isAdmin from localStorage
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    isUserLoggedIn: false,

    // Set role and store it in localStorage
    setRole: (role) => {
        const isAdmin = role === 'admin';
        set({ isAdmin });
        localStorage.setItem('isAdmin', isAdmin); // Save to localStorage
    },

    // Set user login status
    setUserLoggedIn: (status) => set({ isUserLoggedIn: status }),

    // Check user login status based on token in localStorage
    checkUserLoggedIn: () => {
        const token = localStorage.getItem('token');
        set({ isUserLoggedIn: !!token });
    },
}));

export default useAuthStore;