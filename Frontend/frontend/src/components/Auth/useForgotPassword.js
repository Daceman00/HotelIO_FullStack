import { useMutation } from "@tanstack/react-query";
import { forgotPassword as forgotPasswordApi } from "../../services/apiAuth";

export function useForgotPassword() {
    const { mutate: forgotPassword, isLoading, error } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: () => {
            console.log('Password reset email sent');
        }
    })

    return { forgotPassword, isLoading, error }
}
