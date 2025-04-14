import axios from "./../helpers/axios"

export async function getTopSpenders() {
    try {
        const { data } = await axios.get("/bookings/top-spenders")

        return data

    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}
