import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAllRooms } from "../../services/apiRooms";

export function useGetAllRooms({ sort, page = 1, limit }) {
    const queryClient = useQueryClient();
    const { data, isPending, error } = useQuery({
        queryKey: ['rooms', sort, page, limit],
        queryFn: () => getAllRooms({ sort, page, limit }),

        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        refetchOnWindowFocus: false
    })

    const rooms = data?.data?.data ?? [];
    const total = data?.total ?? 0;

    useEffect(() => {
        if (rooms.length >= limit) {
            queryClient.prefetchQuery({
                queryKey: ['rooms', sort, page + 1, limit],
                queryFn: () => getAllRooms({ sort, page: page + 1, limit }),
            });
        }
    }, [page, sort, limit, rooms.length, queryClient]);

    return {
        rooms,
        isPending,
        error,
        total,
        currentPage: page,
        hasMore: rooms.length >= limit,
        nextPage: rooms.length < limit ? null : page + 1
    }
}