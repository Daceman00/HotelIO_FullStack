import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "../../services/apiRooms";

export function useGetAllRooms(sort) {
    const { data: rooms, isPending, error } = useQuery({
        queryKey: ['rooms', sort],
        queryFn: () => getAllRooms(sort)
    })

    return { rooms, isPending, error }
}