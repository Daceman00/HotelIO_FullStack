import { create } from "zustand"

const useUIStore = create((set) => ({
    userCardVisible: false,
    setToggleUserCard: () => set((state) => ({ userCardVisible: !state.userCardVisible })),
    setResetUserCard: () => set(() => ({ userCardVisible: false })),

    isModalOpen: false,
    onModalOpen: () => set({ isModalOpen: true }),
    onModalClose: () => set({ isModalOpen: false }),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    setResetSearchQuery: () => set(() => ({ searchQuery: '' })),

    isLoader: false,
    setIsLoader: (loader) => set({ isLoader: loader }),

    authTab: 'login',
    setAuthTab: (tab) => set({ authTab: tab }),

    sidebarVisible: false,
    toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),

    showDatePicker: false,
    setShowDatePicker: () => set((state) => ({ showDatePicker: !state.showDatePicker })),

    currentPage: 1,
    setCurrentPage: (page) => set({ currentPage: page })

}))

export default useUIStore