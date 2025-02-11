import axios from "./../helpers/axios"

export async function getAllBookings(page = 1, limit = 100) {
    try {
        const params = {
            page,
            limit,
        };
        const { data } = await axios.get(`/bookings`, { params });
        return {
            data: data.data,
            total: data.total,
        }
    } catch (error) {
        console.error(error);
        throw new Error("Bookings not found");
    }

}
export async function createBooking(roomId, bookingData) {
    try {
        const { data } = await axios.post(`/rooms/${roomId}/bookings`, bookingData);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Booking not created");
    }

}

export async function getAllBookingsByRoom(roomId) {
    try {
        const { data } = await axios.get(`/bookings/room/${roomId}`)
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Bookings not found");
    }

}

export async function getBookingById(bookingId) {
    try {
        const { data } = await axios.get(`/bookings/${bookingId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Booking not found");
    }
}

export async function deleteBooking(bookingId) {
    try {
        await axios.delete(`/bookings/${bookingId}`);
    } catch (error) {
        console.error(error);
        throw new Error("Booking not deleted");
    }
}