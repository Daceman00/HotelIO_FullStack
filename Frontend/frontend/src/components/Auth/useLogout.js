
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate: logout, isLoading, error } = useMutation({
        mutationFn: logoutApi,

        onSuccess: () => {
            localStorage.removeItem('token')
            queryClient.setQueryData(['user'], null);
            queryClient.removeQueries()
            toast.success("You are logged out!")
            navigate("/login", { replace: true })
        },
        onError: () => {
            toast.error("Failed to log out. Please try again")
        }

    })
    return { logout, isLoading, error }
}

