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
    try {
        const { data } = await axios.get(`http://localhost:3000/api/v1/users/login`)
    } catch (error) {

    }
}