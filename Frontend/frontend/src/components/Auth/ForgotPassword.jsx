import React from "react";
import { motion } from "framer-motion";
import useFormStore from "../../stores/FormStore";
import { useForgotPassword } from "./useForgotPassword";

function ForgotPassword() {
  const { forgotPassword, isPending } = useForgotPassword();
  const { forgotPasswordData } = useFormStore();
  const updateForgotPasswordData = useFormStore(
    (state) => state.updateForgotPasswordData,
  );
  const resetForgotPasswordData = useFormStore(
    (state) => state.resetForgotPasswordData,
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();

    forgotPassword(forgotPasswordData, {
      onSettled: () => resetForgotPasswordData(),
    });
  };

  const formVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
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

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="flex flex-col items-center pt-6 pb-24 min-h-[60vh] bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-100/80"
    >
      <motion.div
        variants={cardVariants}
        className="w-full max-w-md relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-orange-500/10 pointer-events-none" />
        <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl">
          <div className="p-6 md:p-6 lg:p-8 space-y-5">
            <motion.h1
              variants={formVariants}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
            >
              Enter your email
            </motion.h1>
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <motion.div variants={formVariants}>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Your email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200/80 focus:border-[#dfa974] focus:ring-2 focus:ring-[#dfa974]/25 focus:ring-offset-1 transition-all duration-300 bg-gray-50/80 hover:bg-gray-50 placeholder:text-gray-400"
                  placeholder="Your email"
                  required
                  disabled={isPending}
                  value={forgotPasswordData.email}
                  onChange={(e) =>
                    updateForgotPasswordData("email", e.target.value)
                  }
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
                className="w-full py-3 px-6 text-sm text-white rounded-xl font-medium
                         bg-gradient-to-r from-[#dfa974] to-[#c68a5e] shadow-lg shadow-amber-500/20
                         hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default ForgotPassword;
