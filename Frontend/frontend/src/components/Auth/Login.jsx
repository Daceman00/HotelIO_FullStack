import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useFormStore from "../../stores/FormStore";
import { useLogin } from "./useLogin";
import { Link } from "react-router-dom";
import Loading from "../Reusable/Loading"; // Adjust the import path as necessary
import { modes } from "../../hooks/useServiceConfig"; // Adjust the import path as necessary

const queryClient = new QueryClient();

function Login() {
  const { formData } = useFormStore();
  const updateForm = useFormStore((state) => state.updateForm);
  const resetForm = useFormStore((state) => state.resetForm);
  const { login, isPending } = useLogin();

  const handleSumbit = (e) => {
    e.preventDefault();

    login(formData, {
      onSettled: () => resetForm(),
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Loading mode={modes.all} />
      <section className="flex flex-col items-center pt-6 pb-24">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSumbit}>
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
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                  required
                  disabled={isPending}
                  value={formData.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#dfa974] hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
              <p className="text-sm font-light text-gray-500">
                <Link to="/forgotPassword">
                  <button className="font-medium text-[#dfa974] hover:underline">
                    Forgot password?
                  </button>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </QueryClientProvider>
  );
}

export default Login;
