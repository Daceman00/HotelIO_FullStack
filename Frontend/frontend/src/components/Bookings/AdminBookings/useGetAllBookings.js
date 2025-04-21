import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBookings } from "../../../services/apiBookings";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import useUIStore from "../../../stores/UiStore";

export function useGetAllBookings(status, sort) {
    const queryClient = useQueryClient();
    const { bookingsSearchQuery } = useUIStore();
    const debouncedSearchTerm = useDebounce(bookingsSearchQuery, 500);
    const [effectiveSearch, setEffectiveSearch] = useState('')

    useEffect(() => {
        if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm === '') {
            setEffectiveSearch(debouncedSearchTerm)
            useUIStore.getState().setCurrentPage(1)
        }
    }, [debouncedSearchTerm, setEffectiveSearch])

    const { data: bookings, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["bookings", status, sort, effectiveSearch],
        queryFn: ({ pageParam = 1 }) => getAllBookings({
            limit: 12,
            page: pageParam,
            status,
            sort,
            searchTerm: effectiveSearch
        }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1
    });

    useEffect(() => {
        if (hasNextPage && bookings?.pages?.length > 0) {
            const currentData = bookings.pages[bookings.pages.length - 1];
            queryClient.prefetchInfiniteQuery({
                queryKey: ["bookings", status, sort, effectiveSearch],
                queryFn: ({ pageParam = currentData.nextPage }) => getAllBookings({
                    limit: 12,
                    page: pageParam,
                    status,
                    sort,
                    searchTerm: effectiveSearch
                })
            });
        }
    }, [hasNextPage, bookings?.pages, status, sort, effectiveSearch, queryClient]);

    const bookings_flat = bookings?.pages.flatMap(page => page.data) || [];
    const bookings_total = bookings?.pages[0]?.total || 0;

    return {
        bookings: bookings_flat,
        total: bookings_total,
        isPending,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    };
}