import axios from "./../helpers/axios"

export async function getAllUsers(page = 1, limit = 10, searchTerm = '') {
    try {
        const params = {
            page,
            limit,
        };

        // Only add search param if 3+ characters
        if (searchTerm.length >= 3) {
            params.search = searchTerm;
        }

        const { data } = await axios.get('/users', { params });
        return {
            data: data.data,
            total: data.total,
        };
    } catch (error) {
        console.error('API Error:', error.response);
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
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