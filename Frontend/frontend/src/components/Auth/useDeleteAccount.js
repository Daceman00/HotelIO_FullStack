import { useMutation } from "@tanstack/react-query";
import { deleteAccount as deleteAccountApi } from "../../services/apiAuth";
import { useLogout } from "./useLogout";


export function useDeleteAccount() {
    const { logout } = useLogout()

    const { mutate: deleteAccount, isPending, error } = useMutation({
        mutationFn: deleteAccountApi,
        onSuccess: () => {
            logout({ skipToast: true })
            toast.succes("Account deleted successfully")
        }
    })
    return { deleteAccount, isPending, error };
}