import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../../services/apiBookings";

export function useGetAllBookings(status) {

    const { data: bookings, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["bookings", status],
        queryFn: ({ pageParam = 1 }) => getAllBookings({ limit: 10, page: pageParam, status: status }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1
    });

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