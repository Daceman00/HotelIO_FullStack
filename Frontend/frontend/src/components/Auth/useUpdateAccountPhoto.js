import toast from "react-hot-toast";
import { updateAccountPhoto as updateAccountPhotoApi } from "../../services/apiAuth";
import { useMutation } from "@tanstack/react-query";

export function useUpdateAccountPhoto() {

    const { mutate: updateAccountPhoto, isPending, error } = useMutation({
        mutationFn: updateAccountPhotoApi,
        onSuccess: () => {
            toast.success("Account successfully updated!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update account photo")
        }
    })

    return { updateAccountPhoto, isPending, error }
}