import { useQuery } from "@tanstack/react-query";
import { getBookingsCounts } from "../../../services/apiBookings";

export function useGetBookingsCount() {
    const { data: bookings_counts, error: error_count, isPending: isPending_count, refetch } = useQuery({
        queryFn: getBookingsCounts,
        queryKey: ['bookings']
    })
    return { bookings_counts, error_count, isPending_count, refetch }
}