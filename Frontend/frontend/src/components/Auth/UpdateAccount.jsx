import React, { useEffect, useState } from "react";
import Loading from "../Reusable/Loading";
import { useIsLoggedIn } from "./useAuth";
import useFormStore from "../../stores/FormStore";
import { Link } from "react-router-dom";
import Modal from "../Reusable/Modal";
import useUIStore from "../../stores/UiStore";
import { useDeleteAccount } from "./useDeleteAccount";
import { useMoveBack } from "../../hooks/useMoveBack";
import { modes } from "../../hooks/useServiceConfig";
import useFileStore from "../../stores/FileStore";
import { useUpdateAccountPhoto } from "./useUpdateAccountPhoto";
import FileUploadInput from "../Reusable/FileUploadInput";
import WarningButton from "../Reusable/WarningButton";

function UpdateAccount() {
  const { user, isPending } = useIsLoggedIn();
  const { updateAccountFormData } = useFormStore();
  const setUpdateAccountFormData = useFormStore(
    (state) => state.setUpdateAccountFormData
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
    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      // Send FormData directly, not wrapped in an object
      await updateAccountPhoto(formData);
    }
  };

  const handleConfirmModal = () => {
    deleteAccount();
    onModalClose();
  };

  return (
    <section className="flex flex-col items-center pt-6 pb-6">
      {false ? (
        <Loading mode={modes.all} />
      ) : (
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Update Your Account Information
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <FileUploadInput />
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={updateAccountFormData.name}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={updateAccountFormData.email}
                  disabled
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#dfa379] hover:bg-[#c48960] focus:ring-4 focus:outline-none focus:ring-[#dfa379]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#dfa379] dark:hover:bg-[#c48960] dark:focus:ring-[#dfa379]/50"
              >
                Update Account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Want to change your password?{" "}
                <Link to="/updatePassword">
                  <button className="font-medium text-[#dfa379] hover:text-[#c48960] hover:underline dark:text-[#dfa379]">
                    Click Here!
                  </button>
                </Link>
              </p>
            </form>
            <WarningButton onClick={onModalOpen} />
          </div>
        </div>
      )}
      {isModalOpen ? (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          title={"Are you sure you want permanently delete your account?"}
          description={
            "If you delete your account, you will lose all your data!"
          }
          onConfirm={handleConfirmModal}
          isPending={isPendingDelete}
          opacity="50"
        />
      ) : null}
    </section>
  );
}

export default UpdateAccount;
