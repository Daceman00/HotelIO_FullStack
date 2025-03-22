import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/apiAuth"
import useAuthStore from "../../stores/AuthStore";

export function useIsLoggedIn() {
    const { setUserLoggedIn, setRole, logout } = useAuthStore();
    const token = localStorage.getItem('token')

    const { data: user, isPending, isError } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token),
        enabled: !!token,
        retry: false,

        onSuccess: (userData) => {
            console.log("User data:", userData)
            if (!userData) {
                logout()
                return
            }
            setUserLoggedIn(true);

        },
        onError: () => {
            logout() //Clear invalid session
        }
    })

    return { user, isPending, isError }
}