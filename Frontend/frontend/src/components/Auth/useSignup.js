import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/AuthStore";

export function useSignup() {

    const queryClient = useQueryClient()
    const setUserLoggedIn = useAuthStore((state) => state.setUserLoggedIn);

    const { mutate: signup, isPending, error } = useMutation({
        mutationFn: signupApi,

        onSuccess: (response) => {
            const token = response.token
            if (token) {
                localStorage.setItem('token', token)
                setUserLoggedIn(true);
                console.log(response)
                // Show warning if referral code was invalid
                if (response.warning) {
                    toast(response.warning, {
                        icon: '⚠️',
                        duration: 5000,
                    });
                }

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
            toast.error("An error occurred while creating the account. Please try again.");
        }
    })
    return { signup, isPending, error };
}