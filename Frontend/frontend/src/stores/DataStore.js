import { create } from "zustand"


const useDataStore = create((set) => ({
    bookingData: [], // initial state
    setBookingData: (booking) => set((state) => ({ data: [...state.data, booking] })),
}))

export default useDataStore