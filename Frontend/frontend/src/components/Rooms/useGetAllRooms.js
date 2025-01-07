import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "../../services/apiRooms";

export function useGetAllRooms() {
    const { data: rooms, isPending, error } = useQuery({
        queryKey: ['rooms'],
        queryFn: getAllRooms
    })

    return { rooms, isPending, error }
}