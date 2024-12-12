import { useMutation } from "@tanstack/react-query";
import { forgotPassword as forgotPasswordApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useForgotPassword() {
    const navigate = useNavigate()
    const { mutate: forgotPassword, isLoading, error } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: () => {
            toast.success("Password reset email sent!")
            navigate('/resetPassword')
        },
        onError: () => {
            toast.error("There is no account with that email!")
        }
    })

    return { forgotPassword, isLoading, error }
}
