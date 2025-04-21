import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";



export const useBookStore = create((set, get) => ({
    books:[],
    book: {},
    similarBooks: [],
    myBooks: [],
    isBooksLoading: false,
    isBookLoading: false,
    isCreatingBook: false,
    isUpdatingBook: false,
    isDeletingBook: false,

    getBookById: async (id) => {
        set({ isBookLoading: true });
        try {
            const res = await axiosInstance.get(`/books/${id}`);
            set({ book: res.data });
            get().getSimilarBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch book");
            throw error;
        } finally {
            set({ isBookLoading: false });

        }
    },

    getBooks: async () => {
        set({ isBooksLoading: true });
        try {
            const res = await axiosInstance.get("/books/");
            set({ books: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch books");
            throw error;
        } finally {
            set({ isBooksLoading: false });
        }
    },
    createBook: async (book) => {
        set({ isCreatingBook: true });
        try {
            const res = await axiosInstance.post("/books/create", book);
            set((state) => ({ books: [...state.books, res.data] }));
            toast.success("Book created successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create book");
            throw error;
        } finally {
            set({ isCreatingBook: false });
        }
    },
    updateBook: async (book) => {
        set({ isUpdatingBook: true });
        try {
            const res = await axiosInstance.put(`/books/${book._id}`, book);
            set((state) => ({
                books: state.books.map((b) => (b._id === book._id ? res.data : b)),
                book: res.data,
            }));
            toast.success("Book updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update book");
            throw error;
        } finally {
            set({ isUpdatingBook: false });
        }
    },
    getSimilarBooks: () => {
        // search books in books variable that have at least one category in common with the current book and set similarBooks
        const { book, books } = get();
        const categories = book.categories || [];
        const filteredBooks = books.filter((b) => {
            return b._id !== book._id && b.categories.some((c) => categories.includes(c));
        });
        set({ similarBooks: filteredBooks });
    },
    getMyBook: async () => {
        set({ isBooksLoading: true });
        try {
            const res = await axiosInstance.get("/books/my-books");
            set({ myBooks: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch books");
            throw error;
        } finally {
            set({ isBooksLoading: false });
        }
    },
}));
