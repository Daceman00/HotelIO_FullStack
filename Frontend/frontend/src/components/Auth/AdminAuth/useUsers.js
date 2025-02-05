import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../../services/apiUsers";
import useUIStore from "../../../stores/UiStore";
import { useDebounce } from "../../../hooks/useDebounce";

export function useUsers() {
    const { currentPage } = useUIStore();
    const { searchQuery } = useUIStore();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);

    const { data: users, isPending, error } = useQuery({
        queryKey: ['users', currentPage, debouncedSearchTerm],
        queryFn: ({ signal }) => getAllUsers(currentPage, 10, debouncedSearchTerm, signal),
        keepPreviousData: true,
    })

    return {
        users: users?.data || [],
        total: users?.total || 0,
        isPending,
        error
    }
}