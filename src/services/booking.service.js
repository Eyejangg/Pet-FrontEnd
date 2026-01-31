import api from "./api";

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL;

const createBooking = async (bookingData) => {
    return await api.post(BOOKING_URL, bookingData);
};

const getBookingsByProvider = async () => {
    return await api.get(`${BOOKING_URL}/provider-bookings`);
};

const getBookingsByUser = async () => {
    return await api.get(`${BOOKING_URL}/my-bookings`);
};

const getBookingAvailability = async (serviceId) => {
    return await api.get(`${BOOKING_URL}/service/${serviceId}/availability`);
};

const updateBookingStatus = async (id, status) => {
    return await api.put(`${BOOKING_URL}/${id}/status`, { status });
};

const cancelBooking = async (id) => {
    return await api.put(`${BOOKING_URL}/${id}/cancel`);
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
