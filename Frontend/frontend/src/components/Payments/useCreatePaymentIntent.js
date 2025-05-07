import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../../services/apiPayments";

export function useCreatePaymentIntent(bookingId) {
    const setClientSecret = usePaymentStore((state) => state.setClientSecret);
    const { data: paymentIntent, error, isPending } = useMutation({
        mutationKey: ['paymentIntent'],
        mutationFn: () => createPaymentIntent(bookingId),
        onSuccess: (data) => {
            setClientSecret(data.clientSecret);
        },
    });

    return { paymentIntent, error, isPending };
}
