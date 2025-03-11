import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomPhotos as updateRoomPhotosApi } from "../../services/apiRooms";

export function useUpdateRoomPhotos() {
    const queryClient = useQueryClient()
    const { mutate: updateRoomPhotos, error, isPending } = useMutation({
        mutationFn: (roomId, photoData) => updateRoomPhotosApi(roomId, photoData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["room"],
            })
            toast.success('Room photo updated successfully');
        },
        onError: (error) => {
            toast.error('Error updating room photo');
        }
    })
    return { updateRoomPhotos, error, isPending }
}