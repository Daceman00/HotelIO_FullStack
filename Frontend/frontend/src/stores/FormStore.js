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
    },

    bookingFormData: {
        checkIn: '',
        checkOut: '',
        numOfGuests: '1',
    },

    updateBookingForm: (field, value) => set((state) => ({
        bookingFormData: {
            ...state.bookingFormData,
            [field]: value
        }
    })),

    resetBookingForm: () => {
        set({
            bookingFormData: {
                checkIn: '',
                checkOut: '',
                numOfGuests: '1',
            }
        })
    },

    reviewData: {
        review: '',
        rating: 0
    },

    setReviewData: (field, value) => set((state) => ({
        reviewData: {
            ...state.reviewData,
            [field]: value
        }
    })),

    resetReviewData: () => {
        set({
            reviewData: {
                review: '',
                rating: 0
            }
        })
    },

    roomData: {
        roomNumber: '',
        roomType: '',
        price: 0,
        description: '',
        features: [],
        maxGuests: 1,
    },

    setRoomData: (field, value) => set((state) => ({
        roomData: {
            ...state.roomData,
            [field]: value
        }
    })),

    resetRoomData: () => set({
        roomData: {
            roomNumber: '',
            roomType: '',
            price: 0,
            description: '',
            features: [],
            maxGuests: 1,
        }
    }),

    roomImagesData: {
        imageCover: '',
        images: [],
    },

    setRoomImagesData: (field, value) => set((state) => ({
        roomImagesData: {
            ...state.roomImagesData,
            [field]: value
        }
    })),

    addImageToRoomImagesData: (image) => set((state) => ({
        roomImagesData: {
            ...state.roomImagesData,
            images: [...state.roomImagesData.images, image]
        }
    })),

    resetRoomImagesData: () => set({
        roomImagesData: {
            imageCover: '',
            images: [],
        }
    })

}))

export default useFormStore