// PaymentStore.js
import { create } from 'zustand';

const usePaymentStore = create((set) => ({
    clientSecret: null,
    paymentIntentId: null,
    paymentStatus: 'pending',
    loading: false,
    error: null,

    // Set the client secret received from the backend
    setClientSecret: (data) => set((state) => ({
        ...state,
        clientSecret: data,
        paymentIntentId: data.paymentIntentId || state.paymentIntentId
    })),

    // Set the payment intent ID separately if needed
    setPaymentIntentId: (id) => set((state) => ({
        ...state,
        paymentIntentId: id
    })),

    // Update payment status
    setPaymentStatus: (status) => set((state) => ({
        ...state,
        paymentStatus: status
    })),

    // Set loading state
    setLoading: (isLoading) => set((state) => ({
        ...state,
        loading: isLoading
    })),

    // Set error state
    setError: (error) => set((state) => ({
        ...state,
        error: error
    })),

    // Reset the payment store
    resetPayment: () => set({
        clientSecret: null,
        paymentIntentId: null,
        paymentStatus: 'pending',
        loading: false,
        error: null
    })
}));

export default usePaymentStore;