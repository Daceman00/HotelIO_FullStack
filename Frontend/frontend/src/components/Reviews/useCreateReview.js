import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview as createReviewApi } from "../../services/apiReviews";
import toast from "react-hot-toast";

export function useCreateReview() {
    const queryClient = useQueryClient();
    const { mutate: createReview, isPending, error } = useMutation({
        mutationFn: ({ roomId, reviewData }) => createReviewApi(roomId, reviewData),
        onSuccess: () => {
            toast.success("Review created successfully");
            queryClient.invalidateQueries(["reviews"]);
        },
        onError: (error) => {
            console.error(error);
            toast.error("You can only leave a review after completing a stay")
        }
    });

    return { createReview, isPending, error }
}