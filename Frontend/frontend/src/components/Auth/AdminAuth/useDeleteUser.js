import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser as deleteUserApi } from "../../../services/apiUsers";
import toast from "react-hot-toast";

export function useDeleteUser() {
    const queryClient = useQueryClient();
    const { mutate: deleteUser, error, isPending } = useMutation({

        mutationFn: deleteUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            })
            toast.success('User deleted successfully');
        }
    })
    return { deleteUser, error, isPending }
}