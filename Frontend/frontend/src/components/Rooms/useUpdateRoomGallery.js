import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomGalleryPhotos } from "../../services/apiRooms";
import toast from "react-hot-toast";

export function useUpdateRoomGallery() {
    const queryClient = useQueryClient();

    const { mutate: updateRoomGallery, error, isPending } = useMutation({
        mutationFn: ({ roomId, formData }) => updateRoomGalleryPhotos(roomId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["rooms"],
            });
            toast.success('Room gallery updated successfully');
        },
        onError: (error) => {
            toast.error('Error updating room gallery');
        }
    });

    return { updateRoomGallery, error, isPending };
}