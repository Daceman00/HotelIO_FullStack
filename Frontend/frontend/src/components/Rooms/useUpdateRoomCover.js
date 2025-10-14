import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomCoverPhoto } from "../../services/apiRooms";
import toast from "react-hot-toast";

export function useUpdateRoomCover() {
    const queryClient = useQueryClient()
    const { mutate: updateRoomCover, error, isPending } = useMutation({
        mutationFn: ({ roomId, formData }) => updateRoomCoverPhoto(roomId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries(["rooms"], ["room"])
            toast.success('Room photo updated successfully');
        },
        onError: (error) => {
            toast.error('Error updating room photo');
        }
    })
    return { updateRoomCover, error, isPending }
}