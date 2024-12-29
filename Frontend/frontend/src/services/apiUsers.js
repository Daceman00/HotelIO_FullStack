import axios from "./../helpers/axios"

export async function getAllUsers() {
    try {
        const { data } = await axios.get(`/users`)
        return data.data
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