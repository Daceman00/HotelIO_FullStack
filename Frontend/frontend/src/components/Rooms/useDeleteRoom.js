import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom as deleteRoomApi } from "../../services/apiRooms"
import toast from "react-hot-toast";

export function useDeleteRoom() {
    const queryClient = useQueryClient();
    const { mutate: deleteRoom, error, isPending } = useMutation({
        mutationFn: (roomId) => deleteRoomApi(roomId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Room deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting room');
        }

    })
    return { deleteRoom, error, isPending };
}