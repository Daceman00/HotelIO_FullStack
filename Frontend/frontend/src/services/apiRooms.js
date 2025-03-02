import axios from "axios";

export async function getAllRooms(sort) {
    try {
        const params = {
            sort
        }
        const { data } = await axios.get(`/rooms`, { params })
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}

export async function getRoom(roomId) {
    try {
        const { data } = await axios.get(`/rooms/${roomId}`)
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}