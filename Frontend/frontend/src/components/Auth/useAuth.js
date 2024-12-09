import { useQuery } from "@tanstack/react-query";

export function useIsLoggedIn() {
    const { data: user, isLoading } = useQuery({
        queryKey: ['user', user],
        queryFn: 
    })
}