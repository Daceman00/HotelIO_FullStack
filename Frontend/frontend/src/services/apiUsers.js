import axios from "./../helpers/axios"

export async function getAllUsers(page = 1, limit = 10, searchQuery = '') {
    try {
        const { data } = await axios.get(`/users`, {
            params: {
                page,
                limit,
                search: searchQuery
            },
            signal: new AbortController().signal
        })
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

export async function deleteUser(userID) {
    try {
        await axios.delete(`/ users / ${userID}`)
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}