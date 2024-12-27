import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignup() {
    const navigate = useNavigate()

    const { mutate: signup, isPending } = useMutation({
        mutationFn: signupApi,
        onSuccess: (user) => {
            const token = user.token
            if (token) {
                localStorage.setItem('token', token)
                toast.success("Account succesfully created!")
            } else {
                toast.error("Token missing in response")
            }

            navigate('/dashboard')

        },
        onError: (error) => {
            console.error(error);
            toast.error("User already exist!")
        }
    })
    return { signup, isPending };
}