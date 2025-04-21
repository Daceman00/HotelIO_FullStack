import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import useFormStore from "../../stores/FormStore";
import { useLogin } from "./useLogin";
import { Link } from "react-router-dom";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

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

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <motion.section className="flex flex-col items-center flex-1 justify-center py-1 md:py-0.5 lg:py-2">
        <motion.div className="w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
          <div className="p-4 md:p-2 lg:p-4">
            <motion.h1 className="text-base md:text-sm lg:text-base font-bold text-gray-900 text-center mb-4 md:mb-2 lg:mb-4">
              Welcome Back
            </motion.h1>
            <form
              className="space-y-4 md:space-y-2 lg:space-y-4"
              onSubmit={handleSumbit}
            >
              <AnimatePresence>
                {/* Email Input */}
                <motion.div
                  variants={formVariants}
                  className="space-y-2 md:space-y-1 lg:space-y-2"
                >
                  <motion.label className="text-sm md:text-xs lg:text-sm font-medium text-gray-700">
                    Email
                  </motion.label>
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    animate="blur"
                    type="email"
                    name="email"
                    className="w-full px-4 md:px-2 lg:px-4 py-2 md:py-1.5 lg:py-2 text-sm md:text-xs lg:text-sm rounded-lg border border-gray-200 focus:border-[#dfa974] focus:ring-2 focus:ring-[#dfa974]/20 transition-all duration-200 bg-white/50"
                    placeholder="Enter your email"
                    required
                    disabled={isPending}
                    value={formData.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                  />
                </motion.div>

                {/* Password Input */}
                <motion.div
                  variants={formVariants}
                  className="space-y-2 md:space-y-1 lg:space-y-2"
                >
                  <motion.label className="text-sm md:text-xs lg:text-sm font-medium text-gray-700">
                    Password
                  </motion.label>
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    animate="blur"
                    type="password"
                    name="password"
                    className="w-full px-4 md:px-2 lg:px-4 py-2 md:py-1.5 lg:py-2 text-sm md:text-xs lg:text-sm rounded-lg border border-gray-200 focus:border-[#dfa974] focus:ring-2 focus:ring-[#dfa974]/20 transition-all duration-200 bg-white/50"
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                    value={formData.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  variants={formVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 md:py-2 lg:py-3 px-6 md:px-4 lg:px-6 text-sm md:text-xs lg:text-sm text-white bg-[#dfa974] rounded-lg font-medium
                           hover:bg-[#c68a5e] transition-colors duration-200 disabled:opacity-50
                           disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    "Sign in"
                  )}
                </motion.button>

                {/* Forgot Password Link */}
                <motion.div
                  variants={formVariants}
                  className="text-center mt-4 md:mt-2 lg:mt-4"
                >
                  <Link to="/forgotPassword">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-xs text-[#dfa974] hover:text-[#c68a5e] font-medium"
                    >
                      Forgot password?
                    </motion.button>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </motion.section>
    </QueryClientProvider>
  );
}

export default Login;
