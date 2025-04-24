import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../../services/apiBookings";

export function useGetBooking(bookingId) {
    const { data: booking, error, isLoading } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => getBookingById(bookingId),
        enabled: !!bookingId,
    });

    return { booking, error, isLoading };
}