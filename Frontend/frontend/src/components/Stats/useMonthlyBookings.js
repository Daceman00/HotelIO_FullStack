import { useQuery } from "@tanstack/react-query";
import { getMonthlyBookings } from "../../services/apiStats";

export function useGetMonthlyBookings(year) {
    const { data: monthlyBookings, isPending, error } = useQuery({
        queryKey: ['monthlyBookings', year],
        queryFn: () => getMonthlyBookings(year),
    });

    return { monthlyBookings, isPending, error }
}