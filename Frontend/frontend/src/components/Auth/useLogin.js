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
            const token = data?.token;
            const user = data?.data?.user;

            if (!token || !user) {
                toast.error("Invalid login response");
                return;
            }

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            //Sync state with auth store
            setUserLoggedIn(true);
            setRole(data?.data.user.role);

            //Update React Query cache
            queryClient.setQueryData(['user'], user);
            toast.success("Successfully logged in");
            navigate("/dashboard");
        },
        onError: (error) => {
            console.error("Login error:", error);
            toast.error("Login failed: Invalid credentials");
            useAuthStore.getState().logout();
        }
    });

    return { login, isPending, error };
}