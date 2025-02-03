import { create } from "zustand"


const useDataStore = create((set) => ({
    bookingData: [], // initial state
    setBookingData: (booking) => set((state) => ({ data: [...state.data, booking] })),

    bookingModal: false,
    setBookingModal: (value) => set(() => ({ bookingModal: value })),
}))

export default useDataStore