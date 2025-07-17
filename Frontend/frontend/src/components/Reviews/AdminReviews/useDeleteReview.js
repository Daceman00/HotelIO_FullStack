import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview as deleteReviewApi } from "../../../services/apiReviews"
import toast from "react-hot-toast";

export function useDeleteReview() {
    const queryClient = useQueryClient();
    const { mutate: deleteReview, error, isPending } = useMutation({
        mutationFn: (reviewId) => deleteReviewApi(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room"] });
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            toast.success('Review deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting review');
        }
    })
    return { deleteReview, error, isPending }
}