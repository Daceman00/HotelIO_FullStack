import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";

export function useDeleteBooking() {
    const queryClient = useQueryClient();
    const { mutate: deleteBooking, error, isPending } = useMutation({
        mutationKey: ["bookings"],
        mutationFn: (bookingId) => deleteBookingApi(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries('bookings')
            toast.success('Booking deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting booking');
        }
    });

    return { deleteBooking, error, isPending }
}