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

export async function getTopBookers() {
    try {
        const { data } = await axios.get("/bookings/top-bookers")
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

export async function getTotalRevenue() {
    try {
        const { data } = await axios.get("/bookings/total-revenue")
        console.log(data);
        return data
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response.data.message);
    }
}

