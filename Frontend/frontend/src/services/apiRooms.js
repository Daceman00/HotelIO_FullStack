import axios from "./../helpers/axios"

export async function getAllRooms() {
    try {
        const { data } = await axios.get("/rooms")
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}

export async function getRoom(roomId) {
    try {
        const { data } = await axios.get(`/rooms/${roomId}`)
        return data.data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}