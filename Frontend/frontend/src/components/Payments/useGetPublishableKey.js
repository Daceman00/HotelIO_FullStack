import { useMutation, useQuery } from "@tanstack/react-query";
import { getPublishableKey } from "../../services/apiPayments";
import usePaymentStore from "../../stores/PaymentStore";

export function useGetPublishableKey() {
    const { data: publishableKey, error, isPending } = useQuery({
        queryKey: ['publishableKey'],
        queryFn: getPublishableKey,
    });

    return { publishableKey, error, isPending };
}