import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFormStore from "../../stores/FormStore";
import { useSignup } from "./useSignup";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../Reusable/LoadingSpinner";

function Signup() {
  const { formData } = useFormStore();
  const updateForm = useFormStore((state) => state.updateForm);
  const resetForm = useFormStore((state) => state.resetForm);
  const { signup, isPending } = useSignup();
  const navigate = useNavigate();

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

  const handleSumbit = (e) => {
    e.preventDefault();

    signup(formData, {
      onSuccess: () => navigate("/dashboard"),
      onSettled: () => resetForm(),
    });
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="flex flex-col items-center py-1 md:py-0.5 lg:py-2"
    >
      <motion.div className="w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-xl relative">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 backdrop-blur-sm rounded-lg">
            <LoadingSpinner />
          </div>
        )}
        <div className="p-4 md:p-2 lg:p-4">
          <motion.h1
            variants={formVariants}
            className="text-base md:text-sm lg:text-base font-bold text-gray-900 text-center mb-4 md:mb-2 lg:mb-4"
          >
            Create an account
          </motion.h1>
          <form
            className="space-y-4 md:space-y-2 lg:space-y-4"
            onSubmit={handleSumbit}
          >
            <AnimatePresence>
              {/* Name Input */}
              <motion.div
                variants={formVariants}
                className="space-y-2 md:space-y-1 lg:space-y-2"
              >
                <motion.label className="text-sm md:text-xs lg:text-sm font-medium text-gray-700">
                  Your name
                </motion.label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                  type="text"
                  name="name"
                  className="w-full px-4 md:px-2 lg:px-4 py-2 md:py-1.5 lg:py-2 text-sm md:text-xs lg:text-sm rounded-lg border border-gray-200 focus:border-[#dfa974] focus:ring-2 focus:ring-[#dfa974]/20 transition-all duration-200 bg-white/50"
                  placeholder="Enter your name"
                  required
                  disabled={isPending}
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
              </motion.div>

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

              {/* Confirm Password Input */}
              <motion.div
                variants={formVariants}
                className="space-y-2 md:space-y-1 lg:space-y-2"
              >
                <motion.label className="text-sm md:text-xs lg:text-sm font-medium text-gray-700">
                  Confirm Password
                </motion.label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                  type="password"
                  name="passwordConfirm"
                  className="w-full px-4 md:px-2 lg:px-4 py-2 md:py-1.5 lg:py-2 text-sm md:text-xs lg:text-sm rounded-lg border border-gray-200 focus:border-[#dfa974] focus:ring-2 focus:ring-[#dfa974]/20 transition-all duration-200 bg-white/50"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  value={formData.passwordConfirm}
                  onChange={(e) =>
                    updateForm("passwordConfirm", e.target.value)
                  }
                />
              </motion.div>

              {/* Name Input */}
              <motion.div
                variants={formVariants}
                className="space-y-2 md:space-y-1 lg:space-y-2"
              >
                <motion.label className="text-sm md:text-xs lg:text-sm font-medium text-gray-700">
                  Your referral code
                </motion.label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                  type="text"
                  name="name"
                  className="w-full px-4 md:px-2 lg:px-4 py-2 md:py-1.5 lg:py-2 text-sm md:text-xs lg:text-sm rounded-lg border border-gray-200 focus:border-[#dfa974] focus:ring-2 focus:ring-[#dfa974]/20 transition-all duration-200 bg-white/50"
                  placeholder="Enter your referral code"
                  required
                  disabled={isPending}
                  value={formData.referralCode}
                  onChange={(e) => updateForm("referralCode", e.target.value)}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create account"
                )}
              </motion.button>
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default Signup;
