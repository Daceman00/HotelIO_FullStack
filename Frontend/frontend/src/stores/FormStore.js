import { create } from "zustand"

const useFormStore = create((set) => ({
    formData: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    },

    updateForm: (field, value) =>
        set((state) => ({
            formData: {
                ...state.formData,
                [field]: value
            }
        })),

    resetForm: () => {
        set({
            formData: {
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
            }
        })
    }
}))

export default useFormStore