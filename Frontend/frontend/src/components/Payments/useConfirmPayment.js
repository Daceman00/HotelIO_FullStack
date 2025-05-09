import { useMutation } from "@tanstack/react-query";
import { confirmPayment as confirmPaymentApi } from "../../services/apiPayments";
import toast from "react-hot-toast";

export function useConfirmPayment() {
    const { mutate: confirmPayment, error, isPending } = useMutation({
        mutationKey: ['confirmPayment'],
        mutationFn: (paymentIntentId) => confirmPaymentApi(paymentIntentId),
        onSuccess: (data) => {
            if (data.requiresAction) {
                handleRequiredAction(data.clientSecret);
            } else if (data.paymentStatus === "succeeded") {
                toast.success("Payment successful!");
            }
        },
        onError: () => {
            toast.error("Failed to confirm payment.");
        }
    });

    return { confirmPayment, error, isPending };
}