import { useQuery } from "@tanstack/react-query";
import { getTopBookers } from "../../services/apiStats";

export function useTopBookers() {
    const { data, error, isPending } = useQuery({
        queryKey: ["users", "bookings"],
        queryFn: getTopBookers
    })

    const totalPaidBookings = data?.data?.totalPaidBookings ?? 0;
    const topBookersData = data?.data?.topBookers ?? []

    return { topBookersData, totalPaidBookings, error, isPending }
}   