import { useInfiniteQuery } from "@tanstack/react-query";
import { getReviewsForSingleRoom } from "../../services/apiReviews";


export function useReviewsForSingleRoom(roomId) {
    const { data: reviews, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["reviews", roomId],
        queryFn: ({ pageParam = 1 }) => getReviewsForSingleRoom({ limit: 5, page: pageParam, roomId }),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1
    })

    const reviews_flat = reviews?.pages.flatMap(page => page.data.reviews) || [];
    const reviews_total = reviews?.pages[0]?.data.total || 0;

    return {
        reviews: reviews_flat,
        total: reviews_total,
        isPending,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    }
}