export async function Signup({ name, email, password, passwordConfirm }) {
    try {
        const { data } = await axios.post(`http://localhost:3000/api/v1/users/signup`)
        return data;
    } catch (err) {
        console.error(err)
        throw new Error("Signup not succesful")
    }
}