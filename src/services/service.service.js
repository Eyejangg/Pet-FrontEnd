import axios from "axios";
import { useAuth } from "../context/useAuth";

const API_URL = "http://localhost:5000/api/services";

// Get auth token from local storage directly for service calls
// (Or better, pass it from components. But trying to mimic professor's simpler style if possible)
// Professor's PostService example passed 'data' but didn't show auth handling.
// Assuming we need to add the header.

const createService = async (serviceData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': token,
            },
        };
        return await axios.post(API_URL, serviceData, config);
    } catch (error) {
        return error.response;
    }
};

const ServiceService = {
    createService,
};

export default ServiceService;
