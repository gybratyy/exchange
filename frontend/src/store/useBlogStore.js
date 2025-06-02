import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useBlogStore = create((set, get) => ({
    blogs: [],
    blog: {},

    blogsLoading: false,
    blogLoading: false,

    getBlogById: async (id) => {
        set({blogLoading: true});
        try {
            const res = await axiosInstance.get(`/blog/${id}`);
            set({blog: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch book");
            throw error;
        } finally {
            set({blogLoading: false});
        }
    },
    interact: async (action, id) => {
        set({blogLoading: true});
        try {
            const res = await axiosInstance.post(`/blog/${id}/interact`, {action});
            set({blog: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send interaction");
            throw error;
        } finally {
            set({blogLoading: false});
        }
    },
    getAllBlogs: async () => {
        set({blogsLoading: true});
        try {
            const res = await axiosInstance.get(`/blog`);
            set({blogs: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch book");
            throw error;
        } finally {
            set({blogsLoading: false});
        }
    },
    createBlog: async (blog) => {
        set({blogLoading: true});
        try {
            const res = await axiosInstance.post("/blog/create", blog);
            set((state) => ({blogs: [...state.blogs, res.data]}));
            toast.success("Blog created successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create blog");
            throw error;
        } finally {
            set({blogLoading: false});
        }
    },
    addView: async (blogId) => {
        try {
            await axiosInstance.get(`/blog/${blogId}/view`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add view");
            throw error;
        }
    },

}));
