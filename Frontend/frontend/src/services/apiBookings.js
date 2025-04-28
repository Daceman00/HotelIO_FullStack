import axios from "./../helpers/axios"

export async function getAllBookings({ limit = 12, page = 1, status, sort, searchTerm = '' }) {
    try {
        const params = {
            limit,
            page,
            status,
            sort,
        };

        if (searchTerm.length >= 3) {
            params.search = searchTerm;
        }

        const { data } = await axios.get('/bookings', { params });
        return {
            data: data.data.data,
            total: data.total,
            currentPage: page,
            hasMore: data.results >= limit,
            nextPage: data.results < limit ? null : page + 1
        }
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Bookings not found");
    }

}
export async function createBooking(roomId, bookingData) {
    try {
        const { data } = await axios.post(`/rooms/${roomId}/bookings`, bookingData);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Booking not created");
    }

}

export async function getAllBookingsByRoom(roomId) {
    try {
        const { data } = await axios.get(`/bookings/room/${roomId}`)
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Bookings not found");
    }

}

export async function getBookingById(bookingId) {
    try {
        const { data } = await axios.get(`/bookings/${bookingId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Booking not found");
    }
}

export async function deleteBooking(bookingId) {
    try {
        await axios.delete(`/bookings/${bookingId}`);
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Booking not deleted");
    }
}

export async function getBookingsCounts() {
    try {
        const { data } = await axios.get(`/bookings/booking-counts`)
        return data;
    } catch (error) {
        console.error(error)
        throw new Error(error.response?.data?.message || "Cannot get Bookings count")
    }
}

export async function getBookingsByUser({ limit = 10, page = 1, status }) {
    try {
        const params = {
            limit,
            page,
            status
        };
        const { data } = await axios.get('/bookings/user', { params });
        const total = data.total;
        const nextPage = data.results < limit ? undefined : page + 1;
        return {
            data: data.data.data,
            total,
            nextPage
        }
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || "Bookings not found");
    }
}

export async function getUsersBookingsCounts() {
    try {
        const { data } = await axios.get(`/bookings/user/booking-counts`)
        return data;
    } catch (error) {
        console.error(error)
        throw new Error(error.response?.data?.message || "Cannot get Bookings count")
    }
}