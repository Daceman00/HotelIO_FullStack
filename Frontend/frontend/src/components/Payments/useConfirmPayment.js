import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmPayment as confirmPaymentApi } from "../../services/apiPayments";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useConfirmPayment() {
    const redirect = useNavigate()
    const queryClient = useQueryClient()
    const { mutate: confirmPayment, error, isPending } = useMutation({
        mutationKey: ['confirmPayment'],
        mutationFn: (paymentIntentId) => confirmPaymentApi(paymentIntentId),
        onSuccess: (data) => {
            if (data.requiresAction && data.clientSecret) {
                // Return the data so the component can handle the required action
                return data;
            } else if (data.paymentStatus === "succeeded") {
                queryClient.invalidateQueries({ queryKey: ['bookings'] })
                toast.success("Payment successful!");
                redirect("/bookings");
                return data;
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to confirm payment.");
        }
    });

    return { confirmPayment, error, isPending };
}