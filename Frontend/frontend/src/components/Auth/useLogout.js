
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";

export function useLogout() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate: logout, isPending, error } = useMutation({
        mutationFn: logoutApi,
        onMutate: (variables) => {
            // Return context to manage skipping the toast
            return { skipToast: variables?.skipToast };
        },
        onSuccess: (_, context) => {
            localStorage.removeItem('token')
            localStorage.removeItem("isAdmin");
            queryClient.setQueryData(['user'], null);
            queryClient.removeQueries()
            queryClient.invalidateQueries({
                queryKey: ['users']
            })
            useAuthStore.setState({ isAdmin: false }); // Reset Zustand state

            if (!context?.skipToast) {
                toast.success("You are logged out!")
            }

            navigate("/login", { replace: true })
        },
        onError: () => {
            toast.error("Failed to log out. Please try again")
        }

    })
    return { logout, isPending, error }
}

