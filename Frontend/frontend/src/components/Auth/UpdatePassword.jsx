import React from "react";
import { motion } from "framer-motion";
import { useUpdatePassword } from "./useUpdatePassword";
import useFormStore from "../../stores/FormStore";

function UpdatePassword() {
  const { updatePassword, isPending, error } = useUpdatePassword();
  const { updatePasswordData } = useFormStore();
  const setUpdatePasswordData = useFormStore(
    (state) => state.setUpdatePasswordData,
  );
  const resetUpdatePasswordData = useFormStore(
    (state) => state.resetUpdatePasswordData,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePassword(updatePasswordData, {
      onSettled: () => resetUpdatePasswordData(),
    });
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

  const inputClass =
    "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200/80 focus:border-[#dfa379] focus:ring-2 focus:ring-[#dfa379]/25 focus:ring-offset-1 transition-all duration-300 bg-gray-50/80 hover:bg-gray-50 placeholder:text-gray-400 dark:bg-gray-700/50 dark:border-gray-600 dark:focus:border-[#dfa379] dark:text-white dark:placeholder-gray-400";

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="flex flex-col items-center pt-6 pb-[15rem] min-h-[60vh] bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-100/80"
    >
      <motion.div
        variants={cardVariants}
        className="w-full max-w-md relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-orange-500/10 pointer-events-none" />
        <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl dark:bg-gray-800/90 dark:border-gray-700/50">
          <div className="p-6 md:p-6 lg:p-8 space-y-5">
            <motion.h1
              variants={formVariants}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent dark:text-white"
            >
              Update your password
            </motion.h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={formVariants}>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={inputClass}
                  required
                  disabled={isPending}
                  value={updatePasswordData.passwordCurrent}
                  onChange={(e) =>
                    setUpdatePasswordData("passwordCurrent", e.target.value)
                  }
                />
              </motion.div>
              <motion.div variants={formVariants}>
                <label
                  htmlFor="passwordNew"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New password
                </label>
                <input
                  type="password"
                  name="passwordNew"
                  id="passwordNew"
                  placeholder="••••••••"
                  className={inputClass}
                  required
                  disabled={isPending}
                  value={updatePasswordData.password}
                  onChange={(e) =>
                    setUpdatePasswordData("password", e.target.value)
                  }
                />
              </motion.div>
              <motion.div variants={formVariants}>
                <label
                  htmlFor="passwordConfirm"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm your new password
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  placeholder="••••••••"
                  className={inputClass}
                  required
                  disabled={isPending}
                  value={updatePasswordData.passwordConfirm}
                  onChange={(e) =>
                    setUpdatePasswordData("passwordConfirm", e.target.value)
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

export default UpdatePassword;
