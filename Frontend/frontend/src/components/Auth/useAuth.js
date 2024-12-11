import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/apiAuth"

export function useIsLoggedIn() {
    const token = localStorage.getItem('token')

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token),
        enabled: !!token,
        onError: () => {
            localStorage.removeItem('token')
        }
    })


    return { user, isLoading, isError }
}