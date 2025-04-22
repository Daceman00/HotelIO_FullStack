import React from "react";
import { useUpdatePassword } from "./useUpdatePassword";
import useFormStore from "../../stores/FormStore";

function UpdatePassword() {
  const { updatePassword, isPending, error } = useUpdatePassword();
  const { updatePasswordData } = useFormStore();
  const setUpdatePasswordData = useFormStore(
    (state) => state.setUpdatePasswordData
  );
  const resetUpdatePasswordData = useFormStore(
    (state) => state.resetUpdatePasswordData
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePassword(updatePasswordData, {
      onSettled: () => resetUpdatePasswordData(),
    });
  };

  return (
    <section className="flex flex-col items-center pt-6 pb-[15rem]">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Update your password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Current password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                disabled={isPending}
                value={updatePasswordData.passwordCurrent}
                onChange={(e) =>
                  setUpdatePasswordData("passwordCurrent", e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New password
              </label>
              <input
                type="password"
                name="passwordNew"
                id="passwordNew"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                disabled={isPending}
                value={updatePasswordData.password}
                onChange={(e) =>
                  setUpdatePasswordData("password", e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm your new password
              </label>
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                disabled={isPending}
                value={updatePasswordData.passwordConfirm}
                onChange={(e) =>
                  setUpdatePasswordData("passwordConfirm", e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#dfa379] hover:bg-[#c48960] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={isPending}
            >
              {isPending ? "Submiting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UpdatePassword;
