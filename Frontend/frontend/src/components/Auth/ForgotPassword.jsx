import React from "react";
import useFormStore from "../../stores/FormStore";
import { useForgotPassword } from "./useForgotPassword";

function ForgotPassword() {
  const { forgotPassword, isPending } = useForgotPassword();
  const { forgotPasswordData } = useFormStore();
  const updateForgotPasswordData = useFormStore(
    (state) => state.updateForgotPasswordData
  );
  const resetForgotPasswordData = useFormStore(
    (state) => state.resetForgotPasswordData
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();

    forgotPassword(forgotPasswordData, {
      onSettled: () => resetForgotPasswordData(),
    });
  };
  return (
    <section className="flex flex-col items-center pt-6 pb-24 min-h-[60vh]">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Enter your email
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleForgotPassword}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                placeholder="Your email"
                required
                disabled={isPending}
                value={forgotPasswordData.email}
                onChange={(e) =>
                  updateForgotPasswordData("email", e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#dfa974] hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
