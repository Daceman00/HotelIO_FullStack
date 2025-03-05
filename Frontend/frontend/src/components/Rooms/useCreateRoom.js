import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom as createRoomApi } from "../../services/apiRooms";
import toast from "react-hot-toast";

export function useCreateRoom() {
    const queryClient = useQueryClient();
    const { mutate: createRoom, error, isPending } = useMutation({
        mutationFn: (room) => createRoomApi(room),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["rooms"],
            })
            toast.success('Room created successfully');
        },
        onError: (error) => {
            toast.error('Error creating room');
        }
    })
    return { createRoom, error, isPending }
}