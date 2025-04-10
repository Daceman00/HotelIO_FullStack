import axios from "axios";

export async function getAllRooms(sort) {
    try {
        const params = { sort }
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

export async function createRoom(room) {
    try {
        const { data } = await axios.post(`/rooms`, room)
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

export async function updateRoom(roomId, roomData) {
    try {
        const { data } = await axios.patch(`/rooms/${roomId}`, roomData)
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

export async function updateRoomPhotos(roomId, formData) {
    try {
        const { data } = await axios.patch(`/rooms/${roomId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating photo');
    }
}

export async function updateRoomStatus(roomId, status) {
    try {
        const { data } = await axios.patch(`/rooms/${roomId}`, { status })
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}