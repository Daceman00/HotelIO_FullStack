import { useQuery } from "@tanstack/react-query"
import { getAllBookingsByRoom } from "../../services/apiBookings"
import { useParams } from "react-router-dom"

export function useGetAllBookingsByRoom() {
    const { roomId } = useParams()

    const { data: bookings, isPending, error } = useQuery({
        queryKey: ["bookings", roomId],
        queryFn: () => getAllBookingsByRoom(roomId),
    })

    return { bookings, isPending, error }
}