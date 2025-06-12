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
    const hasMore = data?.hasMore ?? false;
    const nextPage = data?.nextPage;

    useEffect(() => {
        if (hasMore) {
            queryClient.prefetchQuery({
                queryKey: ['rooms', sort, nextPage, limit],
                queryFn: () => getAllRooms({ sort, page: nextPage, limit }),
            });
        }
    }, [page, sort, limit, hasMore, nextPage, queryClient]);

    return { rooms, isPending, error, hasMore, nextPage }
}