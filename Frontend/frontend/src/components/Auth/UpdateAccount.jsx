import React, { useEffect, useState } from "react";
import Loading from "../Reusable/Loading";
import { useIsLoggedIn } from "./useAuth";
import useFormStore from "../../stores/FormStore";
import { useUpdateAccountPhoto } from "./useUpdateAccountPhoto";
import { Link } from "react-router-dom";
import Modal from "../Reusable/Modal";
import useUIStore from "../../stores/UiStore";
import { useDeleteAccount } from "./useDeleteAccount";
import { useMoveBack } from "../../hooks/useMoveBack";

function UpdateAccount() {
  const { user, isPending } = useIsLoggedIn();
  const { updateAccountFormData } = useFormStore();
  const setUpdateAccountFormData = useFormStore(
    (state) => state.setUpdateAccountFormData
  );
  const { photoData } = useFormStore();
  const updatePhotoData = useFormStore((state) => state.updatePhotoData);
  const {
    updateAccountPhoto,
    isPending: isPendingPhoto,
    error: errorPhoto,
  } = useUpdateAccountPhoto();

  const {
    deleteAccount,
    isPending: isPendingDelete,
    error: errorDelete,
  } = useDeleteAccount();

  const { isModalOpen } = useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);
  const moveBack = useMoveBack();

  if (isPending) return <Loading />;

  useEffect(() => {
    if (user) {
      setUpdateAccountFormData("name", user?.data.name);
      setUpdateAccountFormData("email", user?.data.email);
    }
  }, [user, setUpdateAccountFormData]);

  const [preview, setPreview] = useState(null); // State for storing preview
  const [error, setError] = useState(null); // State for error messages

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload an image.");
        return;
      }
      const formData = new FormData();
      formData.append("profilePhoto", file);

      setError(null); // Clear any previous error
      setPreview(URL.createObjectURL(file)); // Create a preview URL
      updatePhotoData({ photo: formData }); // Store the file object in photoData
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAccountPhoto(photoData);
  };

  const handleConfirmModal = () => {
    deleteAccount();
    onModalClose();
  };

  return (
    <section className="flex flex-col items-center pt-6 pb-6">
      {false ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Update Your Account Information
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="flex items-center justify-center w-full">
                {errorPhoto && (
                  <p className="mt-2 text-sm text-red-500">
                    {errorPhoto.message}
                  </p>
                )}
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                >
                  {preview ? (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Uploaded preview"
                        className="max-w-full max-h-64 rounded-lg border shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  )}

                  <input
                    onChange={handleFileChange}
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>
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
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isPendingPhoto ? "Updating Photo..." : "Update Account"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Want to change your password?{" "}
                <Link to="/updatePassword">
                  <button className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                    Click Here!
                  </button>
                </Link>
              </p>
            </form>
            <button
              type="button"
              disabled={isPendingDelete}
              onClick={onModalOpen}
              className="w-5rem text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Delete My Account
            </button>
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
