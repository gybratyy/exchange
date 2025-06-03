import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore";

export const useExchangeStore = create((set, get) => ({
    userExchanges: [],
    currentExchangeDetails: null,

    targetBookForExchange: null,
    initiatorOfferedBook: null,

    isLoadingInitiate: false,
    isLoadingUserExchanges: false,
    isLoadingUpdateStatus: false,
    isLoadingDetails: false,
    error: null,

    setTargetBookForExchange: (book) => set({targetBookForExchange: book}),
    setInitiatorOfferedBook: (book) => set({initiatorOfferedBook: book}),
    clearExchangeProposalFlow: () => set({targetBookForExchange: null, initiatorOfferedBook: null}),

    initiateExchange: async (receiverBookId, initiatorBookId) => {
        set({isLoadingInitiate: true, error: null});
        try {
            const res = await axiosInstance.post("/exchanges/initiate", {
                receiverBookId,
                initiatorBookId,
            });
            set((state) => ({
                userExchanges: [res.data, ...state.userExchanges],
                isLoadingInitiate: false,
                currentExchangeDetails: res.data,
            }));
            toast.success("Exchange proposal sent successfully!");
            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to initiate exchange.";
            toast.error(errorMessage);
            set({isLoadingInitiate: false, error: errorMessage});
            throw error;
        }
    },

    fetchUserExchanges: async () => {
        set({isLoadingUserExchanges: true, error: null});
        try {
            const res = await axiosInstance.get("/exchanges/user");
            set({userExchanges: res.data, isLoadingUserExchanges: false});
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch user exchanges.";
            toast.error(errorMessage);
            set({isLoadingUserExchanges: false, error: errorMessage});
        }
    },

    fetchExchangeDetails: async (exchangeId) => {
        set({isLoadingDetails: true, error: null, currentExchangeDetails: null});
        try {
            const res = await axiosInstance.get(`/exchanges/${exchangeId}`);
            set({currentExchangeDetails: res.data, isLoadingDetails: false});
            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch exchange details.";
            toast.error(errorMessage);
            set({isLoadingDetails: false, error: errorMessage});
            throw error;
        }
    },

    updateExchangeStatus: async (exchangeId, newStatus) => {
        set({isLoadingUpdateStatus: true, error: null});
        try {
            const res = await axiosInstance.put(`/exchanges/${exchangeId}/update_status`, {
                status: newStatus,
            });

            set((state) => ({
                userExchanges: state.userExchanges.map((ex) =>
                    ex._id === exchangeId ? res.data : ex
                ),
                currentExchangeDetails: state.currentExchangeDetails?._id === exchangeId ? res.data : state.currentExchangeDetails,
                isLoadingUpdateStatus: false,
            }));
            toast.success(`Exchange status updated to ${newStatus.replace(/_/g, ' ')}.`);
            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update exchange status.";
            toast.error(errorMessage);
            set({isLoadingUpdateStatus: false, error: errorMessage});
            throw error;
        }
    },

    handleNewExchangeProposal: (newExchange) => {
        const authUser = useAuthStore.getState().authUser;
        if (authUser && (newExchange.initiatorUser?._id === authUser._id || newExchange.receiverUser?._id === authUser._id)) {
            set((state) => ({
                userExchanges: [newExchange, ...state.userExchanges.filter(ex => ex._id !== newExchange._id)],
            }));
            toast.info(`You have a new exchange proposal for "${newExchange.receiverBook?.title || newExchange.initiatorBook?.title}"!`);
        }
    },

    handleExchangeStatusUpdated: (updatedExchange) => {
        set((state) => ({
            userExchanges: state.userExchanges.map((ex) =>
                ex._id === updatedExchange._id ? updatedExchange : ex
            ),
            currentExchangeDetails: state.currentExchangeDetails?._id === updatedExchange._id
                ? updatedExchange
                : state.currentExchangeDetails,
        }));
        toast.info(`Exchange for "${updatedExchange.initiatorBook?.title} ↔ ${updatedExchange.receiverBook?.title}" updated to: ${updatedExchange.status.replace(/_/g, ' ')}`);
    },

}));