import axios from "./../helpers/axios"

export async function getAllUsers(page = 1, limit = 10) {
    try {
        const { data } = await axios.get(`/users?page=${page}&limit=${limit}`)
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

export async function deleteUser(userID) {
    try {
        await axios.delete(`/users/${userID}`)
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}