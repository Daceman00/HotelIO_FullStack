import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "../../../services/apiUsers";
import useUIStore from "../../../stores/UiStore";
import { useDebounce } from "../../../hooks/useDebounce";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useUsers() {
    const [searchParams] = useSearchParams();
    const { currentPage } = useUIStore();
    const { userSearchQuery } = useUIStore();
    const debouncedSearchTerm = useDebounce(userSearchQuery, 500);
    const [effectiveSearch, setEffectiveSearch] = useState(searchParams.get("search") || '')
    const queryClient = useQueryClient();

    useEffect(() => {
        if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm === '') {
            setEffectiveSearch(debouncedSearchTerm)
            useUIStore.getState().setCurrentPage(1)
        }
    }, [debouncedSearchTerm, setEffectiveSearch])


    const { data: users, isPending, error } = useQuery({
        queryKey: ['users', currentPage, effectiveSearch],
        queryFn: ({ signal }) => getAllUsers(currentPage, 10, effectiveSearch, signal),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });


    useEffect(() => {
        if (users?.hasNextPage) {
            queryClient.prefetchQuery({
                queryKey: ['users', currentPage + 1, effectiveSearch],
                queryFn: ({ signal }) => getAllUsers(currentPage + 1, 10, effectiveSearch, signal),
            });
        }
    }, [currentPage, effectiveSearch, users?.hasNextPage, queryClient]);


    return {
        users: users?.data || [],
        total: users?.total || 0,
        currentPage: users?.currentPage || 1,
        totalPages: users?.totalPages || 0,
        hasNextPage: users?.hasNextPage || false,
        hasPrevPage: users?.hasPrevPage || false,
        isPending,
        error
    }
}