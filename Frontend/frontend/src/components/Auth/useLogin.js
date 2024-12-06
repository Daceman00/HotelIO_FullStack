import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from '../../services/apiAuth'
import toast from "react-hot-toast";

export function useLogin() {
    const { mutate: login, isLoading } = useMutation({
        mutationFn: loginApi,
        onSuccess: (user) => {
            console.log(user);
            const token = data.token
            if (token) {
                localStorage.setItem("token", token)
                toast.success("You are logged in!")
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error("Something went wrong")
        }
    })

    return { login, isLoading }
}