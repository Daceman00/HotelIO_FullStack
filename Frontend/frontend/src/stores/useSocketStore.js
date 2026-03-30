import { create } from 'zustand';

const useSocketStore = create((set) => ({
    isConnected: false,
    onlineUsers: new Set(),
    lastSeen: new Map(),

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

    // NEW: Set last seen for a user
    setUserLastSeen: (userId, timestamp) => {
        set((state) => {
            const newMap = new Map(state.lastSeenMap);
            newMap.set(userId, new Date(timestamp));
            return { lastSeenMap: newMap };
        });
    },

    // NEW: Set multiple last seen at once
    setLastSeenList: (lastSeenArray) => {
        set((state) => {
            const newMap = new Map(state.lastSeenMap);
            lastSeenArray.forEach(item => {
                newMap.set(item.userId, new Date(item.timestamp));
            });
            return { lastSeenMap: newMap };
        });
    },

    // NEW: Get last seen for a user
    getUserLastSeen: (userId) => {
        const state = get();
        return state.lastSeenMap.get(userId) || null;
    }

}));

export default useSocketStore;