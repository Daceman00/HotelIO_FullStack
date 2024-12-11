import { useQueryClient, useMutation } from "@tanstack/react-query";
import { login as loginApi } from '../../services/apiAuth'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate: login, isLoading } = useMutation({
        mutationFn: loginApi,
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user.user)
            const token = user.token
            if (token) {
                localStorage.setItem("token", token)
                toast.success("You are logged in!")
            }

            navigate("/dashboard")

        },
        onError: (error) => {
            console.error(error);
            toast.error("This account doesn't exist")
        }
    })

    return { login, isLoading }
}