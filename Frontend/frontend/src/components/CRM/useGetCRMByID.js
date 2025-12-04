import { useQuery } from "@tanstack/react-query"
import { getCRMEntryById } from "../../services/apiCRM"

export function useGetCRMByID(id) {
    const { data: crm, isPending, error } = useQuery({
        queryKey: ['crm', id],
        queryFn: () => getCRMEntryById(id)
    })
    return { crm, isPending, error }
}