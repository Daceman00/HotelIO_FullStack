import { useMutation } from "@tanstack/react-query";
import { processPaymentWithDetails } from "../../services/apiPayments";
import toast from "react-hot-toast";

export function useProcessPayment() {
    const { mutate: processPayment, error, isPending } = useMutation({
        mutationKey: ['processPayment'],
        mutationFn: ({ paymentIntentId, paymentMethodId }) => {
            return processPaymentWithDetails(paymentIntentId, paymentMethodId);
        },
        onSuccess: (data) => {
            if (data.paymentStatus === "succeeded") {
                toast.success("Payment processed successfully.");
            } else {
                toast.error("Payment failed.");
            }
        },
        onError: () => {
            toast.error("Failed to process payment.");
        }
    });

    return { processPayment, error, isPending };
}