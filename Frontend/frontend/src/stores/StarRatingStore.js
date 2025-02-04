import { create } from "zustand";

const useStarRatingStore = create((set) => ({
    rating: 0,
    tempRating: 0,
    setRating: (newRating) => set({ rating: newRating }),
    setTempRating: (newTempRating) => set({ tempRating: newTempRating }),
    setDefault: (defaultRating) => set({ rating: defaultRating }),
}));

export default useStarRatingStore;