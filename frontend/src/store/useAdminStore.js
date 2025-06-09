import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
    reports: [],
    isLoading: false,
    error: null,
    fetchReports: async (status = 'active') => {
        set({isLoading: true, error: null});
        try {
            const res = await axiosInstance.get(`/admin/reports?status=${status}`);
            set({reports: res.data, isLoading: false});
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch reports.";
            toast.error(errorMessage);
            set({isLoading: false, error: errorMessage});
        }
    },

    claimReport: async (reportId) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.put(`/admin/reports/${reportId}/claim`);
            set((state) => ({
                reports: state.reports.map(r => r._id === reportId ? res.data.report : r),
                isLoading: false
            }));
            toast.success("Report claimed!");
            return res.data.report;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to claim report.";
            toast.error(errorMessage);
            set({isLoading: false});
            throw error;
        }
    },
    updateReportStatus: async (reportId, status, resolutionNotes) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.put(`/admin/reports/${reportId}/status`, {status, resolutionNotes});
            set(state => ({
                reports: state.reports.filter(r => r._id !== reportId),
                isLoading: false
            }));
            toast.success(`Report status updated to ${status}.`);
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update report status.";
            toast.error(errorMessage);
            set({isLoading: false});
            return false;
        }
    },

    deleteContent: async (resourceType, resourceId) => {
        set({isLoading: true});
        try {
            await axiosInstance.delete(`/admin/content/${resourceType}/${resourceId}`);
            set(state => ({
                reports: state.reports.filter(r => r.resourceId !== resourceId),
                isLoading: false
            }));
            toast.success(`${resourceType} has been deleted.`);
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || `Failed to delete ${resourceType}.`;
            toast.error(errorMessage);
            set({isLoading: false});
            return false;
        }
    }
}));

export const useReportStore = create((set) => ({
    isSubmitting: false,
    submitReport: async (reportData) => {
        set({isSubmitting: true});
        try {
            await axiosInstance.post('/reports', reportData);
            toast.success("Report submitted successfully. Thank you!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to submit report.";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({isSubmitting: false});
        }
    }
}));
