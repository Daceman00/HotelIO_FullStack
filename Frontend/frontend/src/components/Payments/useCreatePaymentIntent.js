import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../../services/apiPayments";
import usePaymentStore from "../../stores/PaymentStore";
import toast from "react-hot-toast";

export function useCreatePaymentIntent() {
    const setClientSecret = usePaymentStore((state) => state.setClientSecret);

    const { mutate: paymentIntent, error, isPending } = useMutation({
        mutationKey: ['paymentIntent'],
        mutationFn: (bookingId) => {
            return createPaymentIntent(bookingId);
        },
        onSuccess: (data) => {
            setClientSecret({ clientSecret: data.clientSecret });
        },
        onError: (err) => {
            toast.error("Error creating payment intent:");
        },
    });
    return { paymentIntent, error, isPending };
}
