import axios from "./../helpers/axios"

export async function getAllBookings() {
    try {
        const { data } = await axios.get("/bookings");
        console.log(data)
        return data
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