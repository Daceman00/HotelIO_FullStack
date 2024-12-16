import { useMutation } from "@tanstack/react-query";
import { forgotPassword as forgotPasswordApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export function useForgotPassword() {

    const { mutate: forgotPassword, isLoading, error } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: () => {
            toast.success("Password reset email sent!")
        },
        onError: () => {
            toast.error("There is no account with that email!")
        }
    })

    return { forgotPassword, isLoading, error }
}
