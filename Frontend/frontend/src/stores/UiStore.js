import { create } from "zustand"

const useUIStore = create((set) => ({
    userCardVisible: false,
    setToggleUserCard: () => set((state) => ({ userCardVisible: !state.userCardVisible })),
    setResetUserCard: () => set(() => ({ userCardVisible: false })),

    isModalOpen: false,
    onModalOpen: () => set({ isModalOpen: true }),
    onModalClose: () => set({ isModalOpen: false }),

    isRoomModalOpen: false,
    onRoomModalOpen: () => set({ isRoomModalOpen: true }),
    onRoomModalClose: () => set({ isRoomModalOpen: false }),

    isRoomUpdateModalOpen: false,
    onRoomUpdateModalOpen: () => set({ isRoomUpdateModalOpen: true }),
    onRoomUpdateModalClose: () => set({ isRoomUpdateModalOpen: false }),

    isRoomImageModalOpen: false,
    onRoomImageModalOpen: () => set({ isRoomImageModalOpen: true }),
    onRoomImageModalClose: () => set({ isRoomImageModalOpen: false }),

    isLoader: false,
    setIsLoader: (loader) => set({ isLoader: loader }),

    authTab: 'login',
    setAuthTab: (tab) => set({ authTab: tab }),

    sidebarVisible: false,
    toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),

    showDatePicker: false,
    setShowDatePicker: () => set((state) => ({ showDatePicker: !state.showDatePicker })),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    setResetSearchQuery: () => set(() => ({ searchQuery: '' })),

    currentPage: 1,
    setCurrentPage: (page) => set({ currentPage: page }),

    bookingActiveTab: 'upcoming',
    setBookingActiveTab: (tab) => set({ bookingActiveTab: tab }),

    selectedSortOption: 'created',
    sortOrder: '-', // initial value stays as '-'
    setSelectedSortOption: (option) => set({ selectedSortOption: option }),
    toggleSortOrder: () => set(state => ({ sortOrder: state.sortOrder === '' ? '-' : '' })),

}))

export default useUIStore