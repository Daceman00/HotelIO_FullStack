import axios from "./../helpers/axios"

export async function getAllUsers(page = 1, limit = 10, searchTerm = '') {
    try {
        const params = {
            page,
            limit,
        };

        if (searchTerm.length >= 3) {
            params.search = searchTerm;
        }

        const { data } = await axios.get('/users', { params });
        return {
            data: data.data,
            total: data.total,
            currentPage: page,
            totalPages: data.totalPages,
            hasNextPage: page < Math.ceil(data.total / limit),
            hasPrevPage: page > 1
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
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

export async function changeRole(userID, role) {
    try {
        const { data } = await axios.patch(`/users/${userID}`, { role });
        return data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}