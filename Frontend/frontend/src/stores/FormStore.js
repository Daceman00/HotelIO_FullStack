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
    },

    forgotPasswordData: {
        email: ''
    },

    updateForgotPasswordData: (field, value) =>
        set((state) => ({
            forgotPasswordData: {
                ...state.forgotPasswordData,
                [field]: value
            }
        })),

    resetForgotPasswordData: () => {
        set({
            forgotPasswordData: {
                email: ''
            }
        })
    },

    resetPasswordData: {
        password: '',
        passwordConfirm: ''
    },

    updateResetPasswordData: (filed, value) => {
        set((state) => ({
            ...state.resetPasswordData,
            [filed]: value
        }))
    },

    resetResetPasswordData: () => {
        set({
            password: '',
            passwordConfirm: ''
        })
    }

}))

export default useFormStore