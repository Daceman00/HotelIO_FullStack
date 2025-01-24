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

/* export async function createReview(roomId, review) {
    try {
        const { data } = await axios.post(`/rooms/${roomId}/reviews`, review)
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
} */