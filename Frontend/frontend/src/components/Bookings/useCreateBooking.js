import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import useDataStore from "../../stores/DataStore";
import toast from "react-hot-toast";

export function useCreateBooking() {
    const setBookingData = useDataStore((state) => state.setBookingData);
    const setBookingModal = useDataStore((state) => state.setBookingModal);
    const queryClient = useQueryClient();

    const { mutate: createBooking, isPending, isError } = useMutation({
        mutationFn: ({ roomId, bookingData }) => createBookingApi(roomId, bookingData),

        onMutate: () => {
            setBookingModal(true);
        },

        onSuccess: (responseData) => {
            const booking = responseData.data.booking;
            toast.success("Booking created successfully");
            queryClient.invalidateQueries(["bookings"]);
            setBookingData(booking);
            setBookingModal(true);
        },

        onError: (error) => {
            console.error(error);
            toast.error(error.message);
            setBookingModal(false);
        }
    })

    return { createBooking, isPending, isError }
}