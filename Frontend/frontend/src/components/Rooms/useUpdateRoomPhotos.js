import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomPhoto as updateRoomPhotoApi } from "../../services/apiRooms";

export function useUpdateRoomPhoto() {
    const queryClient = useQueryClient()
    const { mutate: updateRoomPhoto, error, isPending } = useMutation({
        mutationFn: (roomId, photoData) => updateRoomPhotoApi(roomId, photoData),
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
    return { updateRoomPhoto, error, isPending }
}