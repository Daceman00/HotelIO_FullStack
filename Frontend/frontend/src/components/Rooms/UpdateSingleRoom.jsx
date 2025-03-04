import React from "react";
import Modal from "../Reusable/Modal";
import FileUploadInput from "../Reusable/FileUploadInput";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

function UpdateSingleRoom() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl dark:shadow-gray-900/30 transition-all duration-300">
        {false ? (
          <Loading mode={modes.all} />
        ) : (
          <div className="w-full">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Update Room Details
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  Manage your room information and settings
                </p>
              </div>

              <form className="space-y-6">
                <FileUploadInput className="group relative h-32 w-32 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guest Capacity
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-none cursor-not-allowed text-gray-500 dark:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                    rows="4"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price
                  </label>
                  <span className="relative block">
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      USD
                    </span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#dfa379] to-[#c48960] hover:from-[#c48960] hover:to-[#a8734e] text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#dfa379] focus:ring-opacity-50"
                >
                  Update Room Details
                </button>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={onModalClose}
            title={"Confirm Room Deletion"}
            description={
              "This action will permanently remove all room data and cannot be undone."
            }
            onConfirm={handleConfirmModal}
            isPending={isPendingDelete}
            overlayClass="backdrop-blur-sm bg-black/50"
            modalClass="rounded-2xl p-8 max-w-md"
          />
        )}
      </div>
    </section>
  );
}

export default UpdateSingleRoom;
