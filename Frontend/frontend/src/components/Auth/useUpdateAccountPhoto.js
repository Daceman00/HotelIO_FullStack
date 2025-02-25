import toast from "react-hot-toast";
import { updateAccountPhoto as updateAccountPhotoApi } from "../../services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAccountPhoto() {
    const queryClient = useQueryClient()
    const { mutate: updateAccountPhoto, isPending, error } = useMutation({
        mutationFn: (formData) => updateAccountPhotoApi(formData),
        onSuccess: () => {
            queryClient.invalidateQueries(['user'])
            toast.success("Account photo successfully updated!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update account photo")
        }
    })

    return { updateAccountPhoto, isPending, error }
}