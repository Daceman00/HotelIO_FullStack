import React from "react";
import useFormStore from "../../stores/FormStore";
import { useSignup } from "./useSignup";
import Loading from "../Reusable/Loading";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const { formData } = useFormStore();
  const updateForm = useFormStore((state) => state.updateForm);
  const resetForm = useFormStore((state) => state.resetForm);
  const { signup, isPending } = useSignup();
  const navigate = useNavigate();

  const handleSumbit = (e) => {
    e.preventDefault();

    signup(formData, {
      onSuccess: () => navigate("/dashboard"),
      onSettled: () => resetForm(),
    });
  };

  return (
    <section className="flex flex-col items-center pt-6  pb-6">
      {isPending ? (
        <Loading />
      ) : (
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSumbit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your name"
                  required
                  disabled={isPending}
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your email"
                  required
                  disabled={isPending}
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  disabled={isPending}
                  value={formData.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  disabled={isPending}
                  value={formData.passwordConfirm}
                  onChange={(e) =>
                    updateForm("passwordConfirm", e.target.value)
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#dfa974] hover:bg-[#c68a5e] focus:ring-4 focus:outline-none focus:ring-[#dfa974] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#dfa974] dark:hover:bg-[#dfa974] dark:focus:ring-[#dfa974]"
                disabled={isPending}
              >
                {isPending ? "Creating account..." : "Create an account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Signup;
