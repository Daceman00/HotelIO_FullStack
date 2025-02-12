import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";

export function useGetAllBookings() {

    const { data: bookings, isPending, error } = useQuery({
        queryKey: ["bookings"],
        queryFn: ({ signal }) => getAllBookings(100, signal),
        keepPreviousData: true,
    });

    return {
        bookings: bookings?.data || [],
        total: bookings?.total || 0,
        isPending,
        error
    };
}