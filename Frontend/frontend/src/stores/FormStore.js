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
            resetPasswordData: {
                password: '',
                passwordConfirm: ''
            }

        })
    },

    updateAccountFormData: {
        photo: '',
        name: '',
        email: ''
    },

    setUpdateAccountFormData: (field, value) => {
        set((state) => ({
            updateAccountFormData: {
                ...state.updateAccountFormData,
                [field]: value,
            },
        }));
    },

    photo: null,
    updatePhotoData: (photoData) => set({ photo: photoData }),

    updatePasswordData: {
        passwordCurrent: '',
        password: '',
        passwordConfirm: ''
    },

    setUpdatePasswordData: (field, value) => {
        set((state) => ({
            updatePasswordData: {
                ...state.updatePasswordData,
                [field]: value
            }
        }))
    },

    resetUpdatePasswordData: () => {
        set({
            updatePasswordData: {
                passwordCurrent: '',
                password: '',
                passwordConfirm: ''
            }

        })
    }

}))

export default useFormStore