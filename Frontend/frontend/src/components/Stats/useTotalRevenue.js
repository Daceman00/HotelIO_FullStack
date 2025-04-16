import { useQuery } from "@tanstack/react-query";
import { getTotalRevenue } from "../../services/apiStats";

export function usetotalRevenue() {
    const { data: totalRevenue, isPending, error } = useQuery({
        queryKey: ["bookings"],
        queryFn: getTotalRevenue,
    });

    return { totalRevenue, isPending, error };
}