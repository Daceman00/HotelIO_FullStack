import axios from "./../helpers/axios"

export async function signup(userData) {
    try {
        const { data } = await axios.post(`/users/signup`, userData)
        return data;
    } catch (error) {
        throw new Error(error.response?.data)
    }
}

export async function login(userData) {
    try {
        const { data } = await axios.post(`/users/login`, userData)
        return data;

    } catch (error) {
        console.error(error)
        throw new Error("Login not succesful")
    }
}

export async function getUser(token) {
    if (!token) return null;
    try {
        const { data } = await axios.get(`/users/getMyAccount`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return data.data
    } catch (error) {
        console.error(error);
        throw new Error("Login not successful");
    }
}

export async function logout() {
    try {
        await axios.get(`/users/logout`)
    } catch (error) {
        console.error(error);
        throw new Error("Logout not successful");
    }
}

export async function forgotPassword(userEmail) {
    try {
        await axios.post(`/users/forgotPassword`, userEmail)
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function resetPassword(token, passwordData) {
    try {
        await axios.patch(`/users/resetPassword/${token}`, passwordData)
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

export async function updateAccountPhoto(formData) {
    try {
        const { data } = await axios.patch(`/users/updateMyAccount`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating photo');
    }
}

export async function updatePassword(passwordData) {
    try {
        const { data } = await axios.patch(`users/updateMyPassword/`, passwordData)
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}

export async function deleteAccount() {
    try {
        await axios.delete(`/users/deleteMyAccount`)
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}