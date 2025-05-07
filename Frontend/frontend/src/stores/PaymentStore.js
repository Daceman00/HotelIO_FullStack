import { create } from "zustand";

const usePaymentStore = create((set) => ({
    stripePromise: null,
    clientSecret: "",
    setStripePromise: (promise) => set({ stripePromise: promise }),
    setClientSecret: (secret) => set({ clientSecret: secret }),
}))

export default usePaymentStore;