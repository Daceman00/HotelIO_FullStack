import { create } from "zustand"

const useUIStore = create((set) => ({
    sidebarVisible: false,
    setToggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),

}))

export default useUIStore