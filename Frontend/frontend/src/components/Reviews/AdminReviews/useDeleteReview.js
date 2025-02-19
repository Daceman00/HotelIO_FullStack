import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview as deleteReviewApi } from "../../../services/apiReviews"
import toast from "react-hot-toast";

export function useDeleteReview() {
    const queryClient = useQueryClient();
    const { mutate: deleteReview, error, isPending } = useMutation({
        mutationFn: (reviewId) => deleteReviewApi(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["room"],
            })
            toast.success('Review deleted successfully');
        },
    })
    return { deleteReview, error, isPending }
}