import { useMutation } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
    const { mutate: createBooking, isLoading: isPending, error } = useMutation({
        mutationFn: ({ roomId, bookingData }) => createBookingApi(roomId, bookingData),
        onSuccess: () => {
            toast.success("Booking created successfully")
        },

        onError: (error) => {
            console.error(error);
            toast.error("Booking not created")
        }
    })

    return { createBooking, isPending, error }
}