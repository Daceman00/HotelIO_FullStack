import { useQuery } from "@tanstack/react-query";
import { getUserCRMProfile } from "../../services/apiCRM";

export function useGetCRMProfile() {
    const { data: crm, isPending, error } = useQuery({
        queryKey: ['crm'],
        queryFn: getUserCRMProfile
    })

    return { crm: crm?.data?.data, isPending, error }
}