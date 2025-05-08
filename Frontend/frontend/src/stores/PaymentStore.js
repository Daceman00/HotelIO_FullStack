import { create } from "zustand";

const usePaymentStore = create((set) => ({
    stripePromise: null,
    clientSecret: "",
    paymentMethod: null,
    setStripePromise: (promise) => set({ stripePromise: promise }),
    setClientSecret: (secret) => set({ clientSecret: secret }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
}))

export default usePaymentStore;