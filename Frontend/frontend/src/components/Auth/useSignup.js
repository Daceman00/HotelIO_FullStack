import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/AuthStore";

export function useSignup() {

    const queryClient = useQueryClient()
    const setUserLoggedIn = useAuthStore((state) => state.setUserLoggedIn);

    const { mutate: signup, isPending, error } = useMutation({
        mutationFn: signupApi,
        onMutate: async () => {
            setUserLoggedIn(true);
        },
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


        },
        onError: (error) => {
            console.error(error);
            toast.error("User already exist!")
        }
    })
    return { signup, isPending, error };
}