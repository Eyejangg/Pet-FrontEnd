import api from "./api";

const POST_URL = import.meta.env.VITE_POST_URL;

const getAllPosts = async () => {
    return await api.get(POST_URL);
};


const getById = async (id) => {
    return await api.get(`${POST_URL}/${id}`);
};

const createPost = async (postData) => {
    return await api.post(POST_URL, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const updatePost = async (id, postData) => {
    return await api.put(`${POST_URL}/${id}`, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

const deletePost = async (id) => {
    return await api.delete(`${POST_URL}/${id}`);
};

const PostService = {
    getAllPosts,
    getById,
    createPost,
    updatePost,
    deletePost,
};

export default PostService;
