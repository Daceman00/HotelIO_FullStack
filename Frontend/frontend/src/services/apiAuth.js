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