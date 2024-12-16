import { useMutation } from "@tanstack/react-query";
import { resetPassword as resetPasswordApi } from "../../services/apiAuth"
import toast from "react-hot-toast";

export function useResetPassword() {
    const { mutate: resetPassword, isLoading, error } = useMutation({
        mutationFn: ({ token, passwordData }) => {
            console.log("Data received in mutationFn:", { token, passwordData });
            return resetPasswordApi(token, passwordData)
        },
        onSuccess: () => {
            toast.success("Your password has been reset");
        },
        onError: (error) => {
            // Check if error.response exists before accessing it to avoid any undefined errors
            const errorMessage = error?.response?.data?.errors?.password?.message ||
                error?.response?.data?.message ||
                "Something went wrong. Please try again.";
            console.error("Error:", errorMessage);  // Optionally log the error for debugging
            toast.error(errorMessage); // Display error message from backend
        }
    })

    return { resetPassword, isLoading, error }
}
