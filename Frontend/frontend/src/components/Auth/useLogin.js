import { useQueryClient, useMutation } from "@tanstack/react-query";
import { login as loginApi } from '../../services/apiAuth';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";
import axios from 'axios';

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const setRole = useAuthStore((state) => state.setRole);
    const setUserLoggedIn = useAuthStore((state) => state.setUserLoggedIn);

    const { mutate: login, isPending, error } = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            if (!data || !data.token || !data.data?.user) {
                toast.error("Invalid login response");
                useAuthStore.getState().logout();
                return;
            }

            const token = data.token;
            const user = data.data.user;

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            //Sync state with auth store
            setUserLoggedIn(true);
            setRole(data.data.user.role);

            //Update React Query cache
            queryClient.setQueryData(['user'], user);
            toast.success("Successfully logged in");
            navigate("/dashboard");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || "Invalid credentials";
            toast.error(`Login failed: ${errorMessage}`);
            useAuthStore.getState().logout();
        }
    });

    return { login, isPending, error };
}