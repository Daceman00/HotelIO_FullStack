import { useQuery } from "@tanstack/react-query";
import { getTopBookers } from "../../services/apiStats";

export function useTopBookers() {
    const { data: topBookers, error, isPending } = useQuery({
        queryKey: ["users", "bookings"],
        queryFn: getTopBookers
    })

    return { topBookers, error, isPending }
}