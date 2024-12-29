import { create } from "zustand"

const useUIStore = create((set) => ({
    sidebarVisible: false,
    setToggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),

    userCardVisible: false,
    setToggleUserCard: () => set((state) => ({ userCardVisible: !state.userCardVisible })),
    setResetUserCard: () => set(() => ({ userCardVisible: false })),

    isModalOpen: false,
    onModalOpen: () => set({ isModalOpen: true }),
    onModalClose: () => set({ isModalOpen: false }),

}))

export default useUIStore