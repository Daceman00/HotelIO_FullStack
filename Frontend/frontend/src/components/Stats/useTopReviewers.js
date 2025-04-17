import { useQuery } from "@tanstack/react-query";
import { getTopReviewers } from "../../services/apiStats";


export function useTopReviewers() {
    const { data: topReviewers, isLoading, error } = useQuery({
        queryKey: ["topReviewers"],
        queryFn: getTopReviewers
    })
    console.log("topReviewers", topReviewers);
    return { topReviewers, isLoading, error };
}