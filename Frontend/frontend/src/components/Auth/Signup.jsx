import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFormStore from "../../stores/FormStore";
import { useSignup } from "./useSignup";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../Reusable/LoadingSpinner";

const inputVariants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } },
  blur: { scale: 1, transition: { duration: 0.2 } },
};

const formVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const inputBaseClass =
  "w-full px-4 md:px-2 lg:px-4 py-2.5 md:py-1.5 lg:py-2.5 text-sm md:text-xs lg:text-sm rounded-xl border transition-all duration-300 ";
const inputStandaloneClass =
  "border-gray-200/80 focus:border-[#dfa974] focus:ring-2 focus:ring-[#dfa974]/25 focus:ring-offset-1 bg-gray-50/80 hover:bg-gray-50 placeholder:text-gray-400";
const inputEmbeddedClass =
  "border-white/30 bg-white/15 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:ring-offset-0 placeholder:text-gray-400 text-white";

const labelEmbeddedClass =
  "text-sm md:text-xs lg:text-sm font-medium text-white/95";
const labelStandaloneClass =
  "text-sm md:text-xs lg:text-sm font-medium text-gray-700";

function Signup({ embedded = false }) {
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

  const inputClass = embedded
    ? inputBaseClass + inputEmbeddedClass
    : inputBaseClass + inputStandaloneClass;
  const labelClass = embedded ? labelEmbeddedClass : labelStandaloneClass;

  const formContent = (
    <>
      <motion.h1
        variants={formVariants}
        className={
          embedded
            ? "text-lg md:text-base font-bold text-white text-center mb-3 md:mb-2"
            : "text-xl md:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent text-center mb-4 md:mb-2 lg:mb-5"
        }
      >
        Create an account
      </motion.h1>
      <form
        className="space-y-4 md:space-y-2 lg:space-y-4"
        onSubmit={handleSumbit}
      >
        <AnimatePresence>
          <motion.div
            variants={formVariants}
            className="space-y-2 md:space-y-1 lg:space-y-2"
          >
            <motion.label className={labelClass}>Your name</motion.label>
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
              type="text"
              name="name"
              className={inputClass}
              placeholder="Enter your name"
              required
              disabled={isPending}
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />
          </motion.div>

          <motion.div
            variants={formVariants}
            className="space-y-2 md:space-y-1 lg:space-y-2"
          >
            <motion.label className={labelClass}>Email</motion.label>
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
              type="email"
              name="email"
              className={inputClass}
              placeholder="Enter your email"
              required
              disabled={isPending}
              value={formData.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
          </motion.div>

          <motion.div
            variants={formVariants}
            className="space-y-2 md:space-y-1 lg:space-y-2"
          >
            <motion.label className={labelClass}>Password</motion.label>
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
              type="password"
              name="password"
              className={inputClass}
              placeholder="••••••••"
              required
              disabled={isPending}
              value={formData.password}
              onChange={(e) => updateForm("password", e.target.value)}
            />
          </motion.div>

          <motion.div
            variants={formVariants}
            className="space-y-2 md:space-y-1 lg:space-y-2"
          >
            <motion.label className={labelClass}>Confirm Password</motion.label>
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
              type="password"
              name="passwordConfirm"
              className={inputClass}
              placeholder="••••••••"
              required
              disabled={isPending}
              value={formData.passwordConfirm}
              onChange={(e) => updateForm("passwordConfirm", e.target.value)}
            />
          </motion.div>

          <motion.div
            variants={formVariants}
            className="space-y-2 md:space-y-1 lg:space-y-2"
          >
            <motion.label className={labelClass}>
              Your referral code
            </motion.label>
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
              type="text"
              name="referralCode"
              className={inputClass}
              placeholder="Enter your referral code"
              required
              disabled={isPending}
              value={formData.referralCode}
              onChange={(e) => updateForm("referralCode", e.target.value)}
            />
          </motion.div>

          <motion.button
            variants={formVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 25px -5px rgba(223, 169, 116, 0.35)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 md:py-2 lg:py-3 px-6 md:px-4 lg:px-6 text-sm md:text-xs lg:text-sm text-white rounded-xl font-medium
                     bg-gradient-to-r from-[#dfa974] to-[#c68a5e] shadow-lg shadow-amber-500/20
                     hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 disabled:opacity-50
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
    </>
  );

  if (embedded) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="flex flex-col flex-1 justify-center w-full relative"
      >
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 z-10 backdrop-blur-sm rounded-xl">
            <LoadingSpinner />
          </div>
        )}
        <div className="w-full">{formContent}</div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="flex flex-col items-center py-1 md:py-0.5 lg:py-2 min-h-[60vh] bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-100/80"
    >
      <motion.div
        variants={cardVariants}
        className="w-full max-w-md relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-orange-500/10 pointer-events-none" />
        <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl">
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-sm rounded-2xl">
              <LoadingSpinner />
            </div>
          )}
          <div className="p-4 md:p-2 lg:p-6">{formContent}</div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default Signup;
