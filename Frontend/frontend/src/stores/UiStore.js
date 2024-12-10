import { create } from "zustand"

const useUIStore = create((set) => ({
    sidebarVisible: false,
    setToggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),

    userCardVisible: false,
    setToggleUserCard: () => set((state) => ({ userCardVisible: !state.userCardVisible }))

}))

export default useUIStore