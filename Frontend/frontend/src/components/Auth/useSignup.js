import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignup() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate: signup, isPending, error } = useMutation({
        mutationFn: signupApi,
        onSuccess: (user) => {
            const token = user.token
            if (token) {
                localStorage.setItem('token', token)
                toast.success("Account succesfully created!")
            } else {
                toast.error("Token missing in response")
            }
            queryClient.invalidateQueries({
                queryKey: ["users"],
            })
            navigate('/dashboard')

        },
        onError: (error) => {
            console.error(error);
            toast.error("User already exist!")
        }
    })
    return { signup, isPending, error };
}