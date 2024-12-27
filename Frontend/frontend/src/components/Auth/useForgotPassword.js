import { useMutation } from "@tanstack/react-query";
import { forgotPassword as forgotPasswordApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useForgotPassword() {

    const { mutate: forgotPassword, isPending, error } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: () => {
            toast.success("Password reset email sent!")
        },
        onError: () => {
            toast.error("There is no account with that email!")
        }
    })

    return { forgotPassword, isPending, error }
}
