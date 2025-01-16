import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getRoom } from "../../services/apiRooms"

export function useGetRoom() {
    const { roomId } = useParams()

    const { data: room, isPending, error } = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => getRoom(roomId)
    })

    return { room, isPending, error }
}