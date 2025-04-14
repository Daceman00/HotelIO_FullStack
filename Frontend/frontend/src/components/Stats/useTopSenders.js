import { useQuery } from "@tanstack/react-query";
import { getTopSpenders } from "../../services/apiStats";

export function useGetTopSpenders() {
    const { data: topSpenders, error, isPending } = useQuery({
        queryKey: ["users"],
        queryFn: getTopSpenders
    })

    return { topSpenders, error, isPending }
}