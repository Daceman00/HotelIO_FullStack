import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../../services/apiUsers";

export function useUsers(page = 1) {
    const { data: users, isPending, error } = useQuery({
        queryKey: ['users', page],
        queryFn: () => getAllUsers(page),
        keepPreviousData: true,
    })

    return {
        users: users?.data || [],
        total: users?.total || 0,
        isPending,
        error
    }
}