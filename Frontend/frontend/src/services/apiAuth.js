import axios from "axios"

export async function signup(userData) {
    try {
        const { data } = await axios.post(`http://localhost:3000/api/v1/users/signup`, userData)
        return data;
    } catch (err) {
        console.error(err)
        throw new Error("Signup not succesful")
    }
}

export async function login(userData) {
    try {
        const { data } = await axios.post(`http://localhost:3000/api/v1/users/login`, userData)
        return data;
    } catch {
        console.error(err)
        throw new Error("Login not succesful")
    }
}

export async function getUser() {
    let token = localStorage.getItem('token')
    console.log(token)
    try {
        const { data } = await axios.get(`http://localhost:3000/api/v1/users/getMyAccount`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return data
    } catch (error) {
        console.error(error);
        throw new Error("Login not successful");
    }
}

export async function logout() {
    localStorage.removeItem('token')
    try {
        await axios.get(`http://localhost:3000/api/v1/users/logout`)
    } catch (error) {
        console.error(error);
        throw new Error("Logout not successful");
    }
}