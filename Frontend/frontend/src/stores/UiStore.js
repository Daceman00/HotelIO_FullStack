import { create } from "zustand"

const useUIStore = create((set) => ({
    userCardVisible: false,
    setToggleUserCard: () => set((state) => ({ userCardVisible: !state.userCardVisible })),
    setResetUserCard: () => set(() => ({ userCardVisible: false })),

    isModalOpen: false,
    selectedId: null,
    onModalOpen: (Id) => set({ isModalOpen: true, selectedId: Id }),
    onModalClose: () => set({ isModalOpen: false, selectedId: null }),

    isCrmModalOpen: false,
    selectedCrmId: null,
    onCrmModalOpen: (Id) => set({ isCrmModalOpen: true, selectedCrmId: Id }),
    onCrmModalClose: () => set({ isCrmModalOpen: false, selectedCrmId: null }),

    isUserCrmModalOpen: false,
    onUserCrmModalOpen: () => set({ isUserCrmModalOpen: true }),
    onUserCrmModalClose: () => set({ isUserCrmModalOpen: false }),

    isBookingModalOpen: false,
    selectedBookingId: null,
    onBookingModalOpen: (Id) => set({ isBookingModalOpen: true, selectedBookingId: Id }),
    onBookingModalClose: () => set({ isBookingModalOpen: false, selectedBookingId: null }),

    // Review modal states
    isReviewModalOpen: false,
    selectedReviewId: null,
    onReviewModalOpen: (Id) => set({ isReviewModalOpen: true, selectedReviewId: Id }),
    onReviewModalClose: () => set({ isReviewModalOpen: false, selectedReviewId: null }),

    isDeleteRoomModalOpen: false,
    selectedRoomId: null,
    onDeleteRoomModalOpen: (Id) => set({ isDeleteRoomModalOpen: true, selectedRoomId: Id }),
    onDeleteRoomModalClose: () => set({ isDeleteRoomModalOpen: false, selectedRoomId: null }),

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

    userSearchQuery: '',
    setUserSearchQuery: (query) => set({ userSearchQuery: query }),
    setResetUserSearchQuery: () => set(() => ({ userSearchQuery: '' })),

    bookingsSearchQuery: '',
    setBookingsSearchQuery: (query) => set({ bookingsSearchQuery: query }),
    setResetBookingsSearchQuery: () => set(() => ({ bookingsSearchQuery: '' })),

    currentPage: 1,
    setCurrentPage: (page) => set({ currentPage: page }),

    bookingActiveTab: 'upcoming',
    setBookingActiveTab: (tab) => set({ bookingActiveTab: tab }),

    selectedSortOption: 'checkIn',
    sortOrder: '', // initial value stays as '-'
    setSelectedSortOption: (option) => set({ selectedSortOption: option }),
    toggleSortOrder: () => set(state => ({ sortOrder: state.sortOrder === '' ? '-' : '' })),

    selectedFilterOption: [],
    setSelectedFilterOption: (options) => set({ selectedFilterOptions: options }),

    isRefreshing: false,
    setIsRefreshing: (refreshing) => set({ isRefreshing: refreshing }),

}))

export default useUIStore