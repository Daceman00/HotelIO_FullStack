
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";
import axios from "axios";

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { logout: zustandLogout } = useAuthStore();

    const { mutate: logout, isPending, error } = useMutation({
        mutationFn: logoutApi,
        onMutate: (variables) => {
            // Return context to manage optional toast display
            return { skipToast: variables?.skipToast };
        },
        onSuccess: (_, context) => {
            // Clear all client-side authentication traces
            zustandLogout(); // Zustand state cleanup
            axios.defaults.headers.common["Authorization"] = null; // Remove axios header

            // Clear query cache
            queryClient.clear();

            // Optional success feedback
            if (!context?.skipToast) {
                toast.success("Successfully logged out!");
            }

            navigate('/');
        },
        onError: (error) => {
            console.error("Logout error:", error);

            // Force client-side cleanup even if API call fails
            zustandLogout();
            queryClient.clear();
            axios.defaults.headers.common["Authorization"] = null;

            toast.error("Session terminated - Please login again");
            navigate('/');
        }
    });

    // Enhanced logout handler with automatic error handling
    const enhancedLogout = (options = {}) => {
        logout(options, {
            onSettled: () => {
                // Ensure navigation even if there's an error
                navigate('/');
            }
        });
    };

    return { logout: enhancedLogout, isPending, error };
}
