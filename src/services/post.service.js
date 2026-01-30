import api from "./api";

const API_URL = import.meta.env.VITE_POST_URL;

const getAllPosts = async () => {
    return await api.get(API_URL);
};

// Renamed from getServiceById to getById to match Professor's pattern
const getById = async (id) => {
    return await api.get(API_URL + "/" + id);
};

const createPost = async (postData) => {
    return await api.post(API_URL, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const updatePost = async (id, postData) => {
    return await api.put(`${API_URL}/${id}`, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

const deletePost = async (id) => {
    return await api.delete(`${API_URL}/${id}`);
};

const PostService = {
    getAllPosts,
    getById,
    createPost,
    updatePost,
    deletePost,
};

export default PostService;
