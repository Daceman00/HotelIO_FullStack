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

export async function createReview(roomId, reviewData) {
    try {
        const { data } = await axios.post(`/rooms/${roomId}/reviews`, reviewData)
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

export async function deleteReview(reviewId) {
    try {
        await axios.delete(`/reviews/${reviewId}`)
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}