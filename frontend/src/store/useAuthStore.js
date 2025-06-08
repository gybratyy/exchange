import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import {useExchangeStore} from "./useExchangeStore.js";
import i18n from "../i18n.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  preferences: {},
  isFillingPreferences: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      set({ preferences: res.data.preferences });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      set({preferences: res.data.preferences});
      toast.success(i18n.t('Logged in successfully'));
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({authUser: null, socket: null, onlineUsers: []});
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  fillPreferences: async (data) => {
    set({ isFillingPreferences: true });
    try {
      const res = await axiosInstance.post("/auth/update-preferences", data);
      set({ preferences: res.data.user.preferences });
    } catch (error) {
      console.log("Error in filling preferences:", error);
      toast.error(error.response.data.message);
    } finally {
      set({isFillingPreferences: false});
      toast.success("Preferences updated successfully");
    }
  },

  toggleWishlist: async (bookId) => {
    try {
      const res = await axiosInstance.get(`/books/${bookId}/wishlist`);
      toast.success(res.data.message);
      get().checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle wishlist");
      throw error;
    }
  },

  connectSocket: () => {
    const {authUser, socket: currentSocket} = get();
    if (!authUser || currentSocket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    newSocket.connect();
    set({socket: newSocket});

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("new_exchange_proposal", (newExchangeData) => {
      console.log("Socket event: new_exchange_proposal", newExchangeData);
      useExchangeStore.getState().handleNewExchangeProposal(newExchangeData);
    });

    newSocket.on("exchange_status_updated", (updatedExchangeData) => {
      console.log("Socket event: exchange_status_updated", updatedExchangeData);
      useExchangeStore.getState().handleExchangeStatusUpdated(updatedExchangeData);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      toast.error("Socket connection error. Trying to reconnect...");
    });
  },

  disconnectSocket: () => {
    const currentSocket = get().socket;
    if (currentSocket?.connected) {
      currentSocket.off("getOnlineUsers");
      currentSocket.off("new_exchange_proposal");
      currentSocket.off("exchange_status_updated");
      currentSocket.disconnect();
    }
    set({socket: null, onlineUsers: []});
  },
}));