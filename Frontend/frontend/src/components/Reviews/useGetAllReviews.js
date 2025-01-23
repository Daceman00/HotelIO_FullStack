import { useQuery } from "@tanstack/react-query";
import { getAllReviews } from "../../services/apiReviews";

export function useGetAllReviews() {
    const { data: reviews, isPending, error } = useQuery({
        queryKey: ['reviews'],
        queryFn: getAllReviews
    })

    return { reviews, isPending, error }
}