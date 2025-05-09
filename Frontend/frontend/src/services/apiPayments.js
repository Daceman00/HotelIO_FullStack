import axios from "./../helpers/axios"

export async function getPublishableKey() {
    try {
        const { data } = await axios.get('payments/publishable-key');
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Publishable key not found");
    }
}

export async function createPaymentIntent(bookingId) {
    try {
        const { data } = await axios.post('payments/create-payment-intent', {
            bookingId: bookingId
        })
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Payment intent not created");
    }
}

export async function processPayment(paymentIntentId, paymentMethod) {
    try {
        const { data } = await axios.post('payments/process-payment', {
            paymentIntentId: paymentIntentId,
            paymentMethod: paymentMethod
        })
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Payment not processed");
    }

}


export async function confirmPayment(paymentIntentId) {
    try {
        const response = await axios.post(`payments/confirm-payment`, {
            paymentIntentId,
        });

        return response.data;
    } catch (error) {
        console.error("Error confirming payment:", error);
        throw new Error(error.response?.data?.message || "Failed to confirm payment");
    }
}


export async function processPaymentWithDetails(paymentIntentId, paymentMethod) {
    try {
        const response = await axios.post(`${API_URL}/payments/process-payment-details`, {
            paymentIntentId,
            paymentMethod,
        });

        return response.data;
    } catch (error) {
        console.error("Error processing payment details:", error);
        throw new Error(error.response?.data?.message || "Failed to process payment details");
    }
}

