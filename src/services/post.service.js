import api from "./api";

const getAllPosts = async () => {
    return await api.get("/services");
};

// Renamed from getServiceById to getById to match Professor's pattern
const getById = async (id) => {
    return await api.get("/services/" + id);
};

const createPost = async (postData) => {
    return await api.post("/services", postData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const updatePost = async (id, postData) => {
    return await api.put(`/services/${id}`, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

const deletePost = async (id) => {
    return await api.delete(`/services/${id}`);
};

const PostService = {
    getAllPosts,
    getById,
    createPost,
    updatePost,
    deletePost,
};

export default PostService;
