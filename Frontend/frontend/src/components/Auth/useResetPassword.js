import { useMutation } from "@tanstack/react-query";
import { resetPassword as resetPasswordApi } from "../../services/apiAuth"
import toast from "react-hot-toast";

export function useResetPassword() {
    const { mutate: resetPassword, isLoading, error } = useMutation({
        mutationFn: () => resetPasswordApi(passwordData),
        onSuccess: () => {
            toast.success("Your password has been reset");
        },
        onError: () => {
            toast.error("Failed to reset password");
        }
    })

    return { resetPassword, isLoading, error }
}
