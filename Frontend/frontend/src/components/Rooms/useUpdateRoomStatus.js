import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateRoomStatus as updateRoomStatusApi } from "../../services/apiRooms";

export function useUpdateRoomStatus(roomId) {
    const queryClient = useQueryClient();

    const { mutate: updateRoomStatus, error, isPending } = useMutation({
        mutationFn: (status) => updateRoomStatusApi(roomId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["rooms"],
            });
            toast.success('Room status updated successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Error updating room status');
        }
    });

    return { updateRoomStatus, error, isPending };
}