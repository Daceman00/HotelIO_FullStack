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

export async function getReviewsForSingleRoom({ limit, page = 1, roomId }) {
    try {
        const { data } = await axios.get(`/reviews/room/${roomId}`, {
            params: { limit, page }
        })
        const total = data.total;
        const nextPage = data.results < limit ? undefined : page + 1;

        return {
            data: data.data,
            total,
            nextPage
        }

    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }

}