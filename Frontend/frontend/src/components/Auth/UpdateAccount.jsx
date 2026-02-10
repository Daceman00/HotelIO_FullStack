import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsLoggedIn } from "./useAuth";
import useFormStore from "../../stores/FormStore";
import { Link } from "react-router-dom";
import Modal from "../Reusable/Modal";
import useUIStore from "../../stores/UiStore";
import { useDeleteAccount } from "./useDeleteAccount";
import useFileStore from "../../stores/FileStore";
import { useUpdateAccountPhoto } from "./useUpdateAccountPhoto";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Camera, Trash2, Mail, User, Lock } from "lucide-react";
import UserCRMProfile from "../CRM/UserCRMProfile";

function UpdateAccount() {
  const { user, isPending } = useIsLoggedIn();
  const isUserCrmModalOpen = useUIStore((state) => state.isUserCrmModalOpen);
  const onUserCrmModalOpen = useUIStore((state) => state.onUserCrmModalOpen);
  const onUserCrmModalClose = useUIStore((state) => state.onUserCrmModalClose);
  const { updateAccountFormData } = useFormStore();
  const setUpdateAccountFormData = useFormStore(
    (state) => state.setUpdateAccountFormData,
  );
  const { previewUrl, selectedFile } = useFileStore();
  const {
    deleteAccount,
    isPending: isPendingDelete,
    error: errorDelete,
  } = useDeleteAccount();

  const {
    updateAccountPhoto,
    isPending: isPendingUpdatePhoto,
    error: errorUpdatePhoto,
  } = useUpdateAccountPhoto();

  const { isModalOpen } = useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);

  useEffect(() => {
    if (user) {
      setUpdateAccountFormData("name", user?.data.name);
      setUpdateAccountFormData("email", user?.data.email);
    }
  }, [user, setUpdateAccountFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (selectedFile) {
      formData.append("photo", selectedFile);
    }
    formData.append("name", updateAccountFormData.name);
    await updateAccountPhoto(formData);
    // Reset preview and selected file after upload
    useFileStore.setState({ previewUrl: null, selectedFile: null });
  };

  const handleConfirmModal = () => {
    deleteAccount();
    onModalClose();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  // Custom file upload preview component
  const PhotoPreview = () => {
    return (
      <motion.div
        variants={cardVariants}
        className="flex flex-col items-center mb-6"
      >
        <div className="relative mb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#dfa379] shadow-lg ring-2 ring-amber-200/50"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : user?.data.photo ? (
              <img
                src={user?.data.photo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <User size={32} className="text-gray-400" />
              </div>
            )}
          </motion.div>
          <motion.label
            htmlFor="file-upload"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-0 right-0 bg-gradient-to-br from-[#dfa379] to-[#c48960] p-2 rounded-full cursor-pointer shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-shadow duration-200"
          >
            <Camera size={16} className="text-white" />
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const fileReader = new FileReader();
                  const file = e.target.files[0];
                  fileReader.onload = () => {
                    useFileStore.setState({
                      previewUrl: fileReader.result,
                      selectedFile: file,
                    });
                  };
                  fileReader.readAsDataURL(file);
                }
              }}
            />
          </motion.label>
        </div>
        {previewUrl && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm text-red-500 hover:text-red-700 flex items-center transition-colors duration-200"
            onClick={() =>
              useFileStore.setState({ previewUrl: null, selectedFile: null })
            }
          >
            <Trash2 size={14} className="mr-1" />
            Remove
          </motion.button>
        )}
      </motion.div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center pt-8 pb-8 px-4 min-h-[60vh] bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-yellow-50/90"
    >
      {isPending ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl dark:bg-gray-800 overflow-hidden md:mt-0 sm:max-w-md border border-white/60 dark:border-gray-700/50"
        >
          <div className="bg-gradient-to-r from-[#dfa379] via-amber-500/90 to-[#c48960] p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-sm opacity-90 mt-1">
              Update your personal information
            </p>
          </div>

          <div className="p-6 md:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <PhotoPreview />

              <motion.div variants={cardVariants}>
                <label
                  htmlFor="name"
                  className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <User size={16} className="mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50/80 border border-gray-200/80 text-gray-900 rounded-xl focus:ring-2 focus:ring-[#dfa379]/25 focus:border-[#dfa379] focus:ring-offset-1 block w-full p-3 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Your name"
                  value={updateAccountFormData.name}
                  onChange={(e) =>
                    setUpdateAccountFormData("name", e.target.value)
                  }
                  disabled={isPendingUpdatePhoto}
                />
              </motion.div>

              <motion.div variants={cardVariants}>
                <label
                  htmlFor="email"
                  className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <Mail size={16} className="mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-100 border border-gray-300 text-gray-500 rounded-lg block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 cursor-not-allowed"
                  value={updateAccountFormData.email}
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Contact support to change your email address
                </p>
              </motion.div>

              <motion.div variants={cardVariants} className="flex items-center">
                <motion.button
                  disabled={isPendingUpdatePhoto}
                  type="submit"
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 8px 25px -5px rgba(223, 169, 116, 0.35)",
                  }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-white bg-gradient-to-r from-[#dfa379] to-[#c48960] shadow-lg shadow-amber-500/20 font-medium rounded-xl px-5 py-3 text-center transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPendingUpdatePhoto ? (
                    <span className="flex items-center">
                      <LoadingSpinner />
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </motion.div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                <Link
                  to="/updatePassword"
                  className="flex items-center text-sm font-medium text-[#dfa379] hover:text-[#c48960] transition-colors duration-200"
                >
                  <Lock size={16} className="mr-1" />
                  Change Password
                </Link>
                <button
                  type="button"
                  onClick={() => onUserCrmModalOpen()}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  View CRM Profile
                </button>
                <button
                  type="button"
                  onClick={onModalOpen}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center transition-colors duration-200"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          title="Delete Account"
          description="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
          onConfirm={handleConfirmModal}
          isPending={isPendingDelete}
          opacity="50"
        />
      )}

      <AnimatePresence mode="wait">
        {isUserCrmModalOpen && (
          <UserCRMProfile
            isOpen={isUserCrmModalOpen}
            onClose={onUserCrmModalClose}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default UpdateAccount;
