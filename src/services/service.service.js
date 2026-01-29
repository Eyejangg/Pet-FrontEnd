import api from "./api";
const API_URL = import.meta.env.VITE_POST_URL;
// Note: VITE_POST_URL maps to /api/services based on our .env

const getServices = async () => {
    return await api.get(API_URL);
};

const getServiceById = async (id) => {
    return await api.get(API_URL + "/" + id);
};

// Modified createService to match PostService pattern but for Services
const createService = async (serviceData) => {
    return await api.post(API_URL, serviceData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const updateService = async (id, serviceData) => {
    // If updating with file, might need multipart/form-data, 
    // but usually axios handles it if data is FormData.
    // However, explicit header is safer if we sending FormData.
    // If sending JSON, header should be application/json (default).
    // Assuming FormData for update too as it has image.
    return await api.put(`${API_URL}/${id}`, serviceData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

const deleteService = async (id) => {
    return await api.delete(`${API_URL}/${id}`);
};

const ServiceService = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};

export default ServiceService;
