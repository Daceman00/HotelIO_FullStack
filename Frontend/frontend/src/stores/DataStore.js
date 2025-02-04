import { create } from "zustand"


const useDataStore = create((set) => ({
    bookingData: null, // initial state
    setBookingData: (data) => set({ bookingData: data }),

    bookingModal: false,
    setBookingModal: (value) => set(() => ({ bookingModal: value })),
    closeBookingModal: () => set({ bookingModal: false }),
}))

export default useDataStore