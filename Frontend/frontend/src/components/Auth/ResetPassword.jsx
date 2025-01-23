import React from "react";
import useFormStore from "../../stores/FormStore";
import { useResetPassword } from "./useResetPassword";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const { resetPassword, isPending, error } = useResetPassword();
  const { resetPasswordData } = useFormStore();
  const updateResetPasswordData = useFormStore(
    (state) => state.updateResetPasswordData
  );
  const resetResetPasswordData = useFormStore(
    (state) => state.resetResetPasswordData
  );
  const { token } = useParams();

  const handleResetPassword = (e) => {
    e.preventDefault();

    resetPassword(
      { token, passwordData: resetPasswordData },
      {
        onSettled: () => resetResetPasswordData(),
      }
    );
  };

  return (
    <section className="flex flex-col items-center pt-6 pb-24">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Enter your new password
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleResetPassword}
          >
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                required
                disabled={isPending}
                value={resetPasswordData.password}
                onChange={(e) =>
                  updateResetPasswordData("password", e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm your new password
              </label>
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                required
                disabled={isPending}
                value={resetPasswordData.passwordConfirm}
                onChange={(e) =>
                  updateResetPasswordData("passwordConfirm", e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#dfa974] hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
              disabled={isPending}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
