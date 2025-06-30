import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../../services/apiBookings";
import useUIStore from "../../../stores/UiStore";

export function useGetAllBookings(status, sort) {
    const { bookingsSearchQuery } = useUIStore();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        isError,
        refetch
    } = useInfiniteQuery({
        queryKey: ["bookings", status, sort, bookingsSearchQuery],
        queryFn: ({ pageParam = 1 }) =>
            getAllBookings({
                page: pageParam,
                status,
                sort,
                searchTerm: bookingsSearchQuery,
            }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });

    const bookings = data?.pages.flatMap((page) => page.data) ?? [];
    const total = data?.pages[0]?.total ?? 0;

    return {
        bookings,
        error,
        isPending,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        total,
        refetch,
    };
}