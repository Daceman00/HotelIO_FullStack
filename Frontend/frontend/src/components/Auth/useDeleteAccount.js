import { useMutation } from "@tanstack/react-query";
import { deleteAccount as deleteAccountApi } from "../../services/apiAuth";
import { useLogout } from "./useLogout";
import toast from "react-hot-toast";


export function useDeleteAccount() {
    const { logout } = useLogout()

    const { mutate: deleteAccount, isPending, error } = useMutation({
        mutationFn: deleteAccountApi,
        onSuccess: () => {
            logout({ skipToast: true })
            toast.success("Account deleted successfully")
        }
    })
    return { deleteAccount, isPending, error };
}