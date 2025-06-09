import {create} from "zustand";
import {v4 as uuidv4} from 'uuid';

export const useNotificationStore = create((set) => ({
    notifications: [],
    unreadCount: 0,


    addNotification: (notification) => {

        const newNotification = {
            ...notification,
            id: uuidv4(),
            read: false,
            createdAt: new Date()
        };

        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },


    markAsRead: (notificationId) => {
        set((state) => {
            const notificationExists = state.notifications.find(n => n.id === notificationId && !n.read);


            if (!notificationExists) return {};

            return {
                notifications: state.notifications.map((n) =>
                    n.id === notificationId ? {...n, read: true} : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            };
        });
    },
    clearAll: () => set({notifications: [], unreadCount: 0}),
}));
