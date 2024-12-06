import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
    const { mutate: signup, isLoading } = useMutation({
        mutationFn: signupApi,
        onSuccess: (user) => {
            const token = user.token
            if (token) {
                localStorage.setItem('token', token)
                toast.success("Account succesfully created!")
            } else {
                toast.error("Token missing in response")
            }

        },
        onError: (error) => {
            console.error(error);
            toast.error("Something went wrong")
        }
    })
    return { signup, isLoading };
}