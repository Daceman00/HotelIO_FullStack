import { create } from 'zustand';

const useSocketStore = create((set) => ({
    isConnected: false,
    onlineUsers: new Set(),

    setIsConnected: (connected) => set({ isConnected: connected }),

    setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),

    addOnlineUser: (userId) => set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId])
    })),

    removeOnlineUser: (userId) => set((state) => {
        const newSet = new Set(state.onlineUsers);
        newSet.delete(userId);
        return { onlineUsers: newSet };
    }),
}));

export default useSocketStore;