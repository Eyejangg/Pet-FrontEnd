import api from "./api";

const API_URL = import.meta.env.VITE_BOOKING_URL;

const createBooking = async (bookingData) => {
    return await api.post(API_URL, bookingData);
};

const getBookingsByProvider = async () => {
    return await api.get(API_URL + "/provider-bookings");
};

const getBookingsByUser = async () => {
    return await api.get(API_URL + "/my-bookings");
};

const getBookingAvailability = async (serviceId) => {
    return await api.get(API_URL + `/service/${serviceId}/availability`);
};

const updateBookingStatus = async (id, status) => {
    return await api.put(API_URL + `/${id}/status`, { status });
};

const cancelBooking = async (id) => {
    return await api.put(API_URL + `/${id}/cancel`);
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
