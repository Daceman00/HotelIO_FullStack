import { useMutation } from "@tanstack/react-query";

export function useProcessPayment() {
    const { mutate: processPayment, error, isPending } = useMutation({
        mutationKey: ['processPayment'],
        mutationFn: (paymentData) => {
            return processPayment(paymentData.paymentIntentId, paymentData.paymentMethod);
        },
    });

    return { processPayment, error, isPending };
}