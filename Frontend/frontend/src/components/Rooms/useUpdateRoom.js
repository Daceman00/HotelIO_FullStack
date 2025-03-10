import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom as updateRoomApi } from "../../services/apiRooms";
import toast from "react-hot-toast";

export function useUpdateRoom() {
    const queryClient = useQueryClient()
    const { mutate: updateRoom, error, isPending } = useMutation({
        mutationFn: ({ roomId, roomData }) => updateRoomApi(roomId, roomData),
        onSuccess: () => {
            queryClient.invalidateQueries(
                { queryKey: ["room"] }
            )
            toast.success("Room updated successfully")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return { updateRoom, error, isPending }
}