import axios from "axios"

export async function signup(userData) {
    try {
        const { data } = await axios.post(`http://localhost:3000/api/v1/users/signup`, userData)
        return data;
    } catch (error) {
        console.error(error)
        throw new Error("Signup not succesful")
    }
}

export async function login(userData) {
    try {
        const { data } = await axios.post(`http://localhost:3000/api/v1/users/login`, userData)
        return data;
    } catch (error) {
        console.error(error)
        throw new Error("Login not succesful")
    }
}

export async function getUser(token) {
    if (!token) return null;
    try {
        const { data } = await axios.get(`http://localhost:3000/api/v1/users/getMyAccount`, {
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
        await axios.get(`http://localhost:3000/api/v1/users/logout`)
    } catch (error) {
        console.error(error);
        throw new Error("Logout not successful");
    }
}

export async function forgotPassword(userEmail) {
    try {
        await axios.post(`http://localhost:3000/api/v1/users/forgotPassword`, userEmail)
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export async function resetPassword(token, passwordData) {
    try {
        await axios.patch(`http://localhost:3000/api/v1/users/resetPassword/${token}`, passwordData)
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}