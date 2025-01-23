import axios from "./../helpers/axios"

export async function getAllReviews() {
    try {
        const { data } = await axios.get("/reviews")
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}