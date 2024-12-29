import { useQueryClient, useMutation } from "@tanstack/react-query";
import { login as loginApi } from '../../services/apiAuth'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";
import axios from 'axios';  // Import axios

export function useLogin() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const setRole = useAuthStore((state) => state.setRole)

    const { mutate: login, isPending, error } = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], data?.user)
            const token = data.token
            if (token) {
                localStorage.setItem("token", token)
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                toast.success("You are logged in!")
                setRole(data?.data.user.role);
            }

            navigate("/dashboard")

        },
        onError: (error) => {
            console.error(error);
            toast.error("Incorrect email or password")
        }
    })

    return { login, isPending, error }
}