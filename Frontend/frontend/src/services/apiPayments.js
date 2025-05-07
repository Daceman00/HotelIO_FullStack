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