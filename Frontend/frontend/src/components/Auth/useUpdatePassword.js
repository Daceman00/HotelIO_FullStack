import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword as updatePasswordApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';  // Import axios

export function useUpdatePassword() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate: updatePassword, isPending, error } = useMutation({
        mutationFn: updatePasswordApi,
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user.user)
            const token = user.token
            if (token) {
                localStorage.setItem("token", token)
                // Update the Authorization header for axios
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                toast.success("Password successfully changed!")
            }
            navigate("/dashboard")
        },
        onError: (error) => {
            toast.error("Error changing password")
        },

    })

    return { updatePassword, isPending, error };
}
