import api from "./api";

const createBooking = async (bookingData) => {
    return await api.post("/bookings", bookingData);
};

const getBookingsByProvider = async () => {
    return await api.get("/bookings/provider-bookings");
};

const getBookingsByUser = async () => {
    return await api.get("/bookings/my-bookings");
};

const getBookingAvailability = async (serviceId) => {
    return await api.get(`/bookings/service/${serviceId}/availability`);
};

const updateBookingStatus = async (id, status) => {
    return await api.put(`/bookings/${id}/status`, { status });
};

const cancelBooking = async (id) => {
    return await api.put(`/bookings/${id}/cancel`);
};

const BookingService = {
    createBooking,
    getBookingsByProvider,
    getBookingsByUser,
    getBookingAvailability,
    updateBookingStatus,
    cancelBooking
};

export default BookingService;
