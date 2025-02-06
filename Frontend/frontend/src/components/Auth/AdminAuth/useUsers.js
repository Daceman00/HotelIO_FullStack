import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../../services/apiUsers";
import useUIStore from "../../../stores/UiStore";
import { useDebounce } from "../../../hooks/useDebounce";
import { useEffect, useState } from "react";

export function useUsers() {
    const { currentPage } = useUIStore();
    const { searchQuery } = useUIStore();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);
    const [effectiveSearch, setEffectiveSearch] = useState('')

    useEffect(() => {
        if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm === '') {
            setEffectiveSearch(debouncedSearchTerm)
            useUIStore.getState().setCurrentPage(1)
        }
    }, [debouncedSearchTerm, setEffectiveSearch])

    const { data: users, isPending, error } = useQuery({
        queryKey: ['users', currentPage, effectiveSearch],
        queryFn: ({ signal }) => getAllUsers(currentPage, 10, debouncedSearchTerm, signal),
        keepPreviousData: true,
    });

    return {
        users: users?.data || [],
        total: users?.total || 0,
        isPending,
        error
    }
}