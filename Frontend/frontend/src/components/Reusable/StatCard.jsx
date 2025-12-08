import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function StatCard({ icon: Icon, label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center gap-3">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: "#dfa974", opacity: 0.1 }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
