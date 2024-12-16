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

    updateResetPasswordData: (field, value) => {
        set((state) => ({
            resetPasswordData: {
                ...state.resetPasswordData,
                [field]: value
            }
        }))
    },

    resetResetPasswordData: () => {
        set({
            password: '',
            passwordConfirm: ''
        })
    },

    updateAccountFormData: {
        photo: '',
        name: '',
        email: ''
    },

    updateAccountForm: (field, value) =>
        set((state) => ({
            updateAccountFormData: {
                ...state.updateAccountFormData,
                [field]: value
            }
        })),

}))

export default useFormStore