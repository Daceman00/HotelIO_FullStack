import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../../services/apiBookings";

export function useGetBooking() {
    const { data: booking, error, isLoading } = useQuery({
        queryKey: ["booking"],
        queryFn: () => getBookingById(),
    })

    return { booking, error, isLoading }
} 