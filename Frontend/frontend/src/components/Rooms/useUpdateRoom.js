import { useMutation } from "@tanstack/react-query";
import { updateRoom as updateRoomApi } from "../../services/apiRooms";

export function updateRoom(roomId, roomData) {
    const { mutate: updateRoom, error, isPending } = useMutation({
        mutationFn: () => updateRoomApi(roomId, roomData),
    })
    return { updateRoom, error, isPending }
}