import { useQuery } from "@tanstack/react-query";
import { getTopSpenders } from "../../services/apiStats";

export function useGetTopSpenders() {
    const { data, error, isPending } = useQuery({
        queryKey: ["users"],
        queryFn: getTopSpenders
    })
    const topSpendersData = data?.data?.topSpenders ?? []
    return { topSpendersData, error, isPending }
}