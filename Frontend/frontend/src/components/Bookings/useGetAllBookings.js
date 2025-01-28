import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";

export function useGetAllBookings() {
    const { data: bookings, isPending, error } = useQuery({
        queryKey: ["bookings"],
        queryFn: getAllBookings,
    })

    return { bookings, isPending, error }
}