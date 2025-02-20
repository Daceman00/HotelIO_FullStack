import { useQuery } from "@tanstack/react-query"
import { getUsersBookingsCounts } from "../../services/apiBookings"

export function useGetUsersBookingsCount() {
    const { data: bookings_counts, error: error_count, isPending: isPending_count } = useQuery({
        queryFn: getUsersBookingsCounts,
        queryKey: ['bookings']
    })
    return { bookings_counts, error_count, isPending_count }
}