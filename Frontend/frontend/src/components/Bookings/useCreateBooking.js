import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import useDataStore from "../../stores/DataStore";
import toast from "react-hot-toast";

export function useCreateBooking() {
    const setBookingData = useDataStore((state) => state.setBookingData);
    const setBookingModal = useDataStore((state) => state.setBookingModal);
    const queryClient = useQueryClient();

    const { mutate: createBooking, isPending, error } = useMutation({
        mutationFn: ({ roomId, bookingData }) => createBookingApi(roomId, bookingData),
        onMutate: (data) => {
            setBookingData(data);
        },
        onSuccess: (data) => {
            toast.success("Booking created successfully");
            queryClient.invalidateQueries(["bookings"]);
            setBookingModal(true);
            setBookingData([data])
        },

        onError: (error) => {
            console.error(error);
            toast.error("Booking not created")
        }
    })

    return { createBooking, isPending, error }
}