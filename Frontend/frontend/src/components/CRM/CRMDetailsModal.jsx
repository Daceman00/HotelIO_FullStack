import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  Award,
  Calendar,
  TrendingUp,
  Star,
  Gift,
  Users,
  Crown,
  Target,
  Clock,
  DollarSign,
  Bed,
  Coffee,
} from "lucide-react";
import { useGetCRMByID } from "./useGetCRMByID";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import StatCard from "../Reusable/StatCard";

function CRMDetailsModal({ crmId, isOpen, onClose }) {
  const { crm, isPending, error } = useGetCRMByID(crmId);

  if (!isOpen) return null;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: "bg-orange-100 text-orange-800 border-orange-300",
      silver: "bg-gray-100 text-gray-800 border-gray-300",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
      platinum: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[tier] || colors.bronze;
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div
              className="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
              style={{ backgroundColor: "#dfa974" }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <Crown className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Guest Profile Details
                </h2>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {crm && !isPending && !error && (
                <>
                  {/* Guest Info Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {crm.user?.name || "Guest Name"}
                        </h3>
                        <p className="text-gray-600">
                          {crm.user?.email || "guest@example.com"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTierColor(
                            crm.loyaltyTier
                          )}`}
                        >
                          {crm.loyaltyTier?.toUpperCase() || "BRONZE"} TIER
                        </motion.span>
                        {crm.isVIP && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 border border-purple-300"
                          >
                            VIP GUEST
                          </motion.span>
                        )}
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300"
                        >
                          {crm.guestStatus?.toUpperCase() || "NEW"}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Stay Statistics */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="mb-6"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp
                        className="w-5 h-5"
                        style={{ color: "#dfa974" }}
                      />
                      Stay Statistics
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        icon={Calendar}
                        label="Total Stays"
                        value={crm.stayStatistics?.totalStays || 0}
                        index={0}
                      />
                      <StatCard
                        icon={Clock}
                        label="Total Nights"
                        value={crm.stayStatistics?.totalNights || 0}
                        index={1}
                      />
                      <StatCard
                        icon={DollarSign}
                        label="Lifetime Value"
                        value={`$${crm.stayStatistics?.lifetimeValue || 0}`}
                        index={2}
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Avg Stay Length"
                        value={`${
                          crm.stayStatistics?.averageStayLength || 0
                        } nights`}
                        index={3}
                      />
                    </div>
                    {crm.stayStatistics?.lastStayDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <p className="text-sm text-gray-600">
                          Last Stay:{" "}
                          <span className="font-semibold text-gray-900">
                            {formatDate(crm.stayStatistics.lastStayDate)}
                          </span>
                        </p>
                        {crm.daysSinceLastStay !== null && (
                          <p className="text-sm text-gray-600 mt-1">
                            {crm.daysSinceLastStay} days ago
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Loyalty & Rewards */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mb-6"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" style={{ color: "#dfa974" }} />
                      Loyalty & Rewards
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Current Points
                            </p>
                            <motion.p
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5, type: "spring" }}
                              className="text-3xl font-bold"
                              style={{ color: "#dfa974" }}
                            >
                              {crm.loyaltyPoints || 0}
                            </motion.p>
                          </div>
                          <Award
                            className="w-12 h-12"
                            style={{ color: "#dfa974", opacity: 0.2 }}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Next Tier:</span>
                            <span className="font-semibold text-gray-900">
                              {crm.nextTier?.toUpperCase() || "N/A"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  crm.loyaltyPoints && crm.pointsToNextTier
                                    ? (crm.loyaltyPoints /
                                        (crm.loyaltyPoints +
                                          crm.pointsToNextTier)) *
                                      100
                                    : 0
                                }%`,
                              }}
                              transition={{
                                delay: 0.6,
                                duration: 0.8,
                                ease: "easeOut",
                              }}
                              className="h-2 rounded-full"
                              style={{ backgroundColor: "#dfa974" }}
                            ></motion.div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {crm.pointsToNextTier || 0} points to next tier
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Referral Program
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {crm.referralCode || "N/A"}
                            </p>
                          </div>
                          <Users
                            className="w-12 h-12"
                            style={{ color: "#dfa974", opacity: 0.2 }}
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Referrals Made:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {crm.referralsMade || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Successful:</span>
                            <span className="font-semibold text-gray-900">
                              {crm.successfulReferrals || 0}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Reviews */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="mb-6"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" style={{ color: "#dfa974" }} />
                      Review Statistics
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6, type: "spring" }}
                              className="text-4xl font-bold"
                              style={{ color: "#dfa974" }}
                            >
                              {crm.reviewStatistics?.averageRating?.toFixed(
                                1
                              ) || "0.0"}
                            </motion.div>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star, index) => (
                                <motion.div
                                  key={star}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    delay: 0.7 + index * 0.05,
                                    type: "spring",
                                  }}
                                >
                                  <Star
                                    className="w-4 h-4"
                                    fill={
                                      star <=
                                      (crm.reviewStatistics?.averageRating || 0)
                                        ? "#dfa974"
                                        : "none"
                                    }
                                    style={{ color: "#dfa974" }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">
                              Total Reviews:{" "}
                              <span className="font-semibold text-gray-900">
                                {crm.reviewStatistics?.totalReviews || 0}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Positive:{" "}
                              <span className="font-semibold text-gray-900">
                                {crm.positiveReviewPercentage || 0}%
                              </span>
                            </p>
                            {crm.reviewStatistics?.lastReviewDate && (
                              <p className="text-xs text-gray-500 mt-2">
                                Last:{" "}
                                {formatDate(
                                  crm.reviewStatistics.lastReviewDate
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                      >
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          Rating Distribution
                        </p>
                        {[5, 4, 3, 2, 1].map((rating, index) => (
                          <div
                            key={rating}
                            className="flex items-center gap-2 mb-2"
                          >
                            <span className="text-xs text-gray-600 w-8">
                              {rating} ★
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${
                                    crm.reviewStatistics?.totalReviews > 0
                                      ? ((crm.reviewStatistics
                                          ?.ratingDistribution?.[rating] || 0) /
                                          crm.reviewStatistics.totalReviews) *
                                        100
                                      : 0
                                  }%`,
                                }}
                                transition={{
                                  delay: 0.7 + index * 0.1,
                                  duration: 0.6,
                                  ease: "easeOut",
                                }}
                                className="h-2 rounded-full"
                                style={{ backgroundColor: "#dfa974" }}
                              ></motion.div>
                            </div>
                            <span className="text-xs text-gray-600 w-8 text-right">
                              {crm.reviewStatistics?.ratingDistribution?.[
                                rating
                              ] || 0}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Preferences & Discounts */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Preferences */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Bed className="w-5 h-5" style={{ color: "#dfa974" }} />
                        Guest Preferences
                      </h4>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              Preferred Room Type
                            </p>
                            <p className="text-base font-semibold text-gray-900 capitalize">
                              {crm.guestPreferences?.room?.preferredRoomType ||
                                "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Preferred Amenities
                            </p>
                            {crm.guestPreferences?.amenities?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {crm.guestPreferences.amenities.map(
                                  (amenity, index) => (
                                    <motion.span
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                        delay: 0.7 + index * 0.05,
                                        type: "spring",
                                      }}
                                      whileHover={{ scale: 1.05 }}
                                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-300"
                                    >
                                      <Coffee className="w-3 h-3 inline mr-1" />
                                      {amenity}
                                    </motion.span>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">
                                No amenities selected
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Active Discounts */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Gift
                          className="w-5 h-5"
                          style={{ color: "#dfa974" }}
                        />
                        Active Discounts
                      </h4>
                      <div className="space-y-3">
                        {crm.activeDiscounts?.length > 0 ? (
                          crm.activeDiscounts.map((discount, index) => (
                            <motion.div
                              key={discount.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              className="bg-white rounded-lg p-4 shadow-sm border-2"
                              style={{ borderColor: "#dfa974" }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900">
                                    {discount.code}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {discount.description}
                                  </p>
                                </div>
                                <motion.span
                                  whileHover={{ scale: 1.1 }}
                                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                                  style={{ backgroundColor: "#dfa974" }}
                                >
                                  {discount.type === "percentage"
                                    ? `${discount.value}%`
                                    : `$${discount.value}`}
                                </motion.span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                  Min. {discount.minimumStayNights} night(s)
                                </span>
                                <span>
                                  Expires: {formatDate(discount.expiresAt)}
                                </span>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                            <Gift className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-gray-500">No active discounts</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-6 py-4 border-t border-gray-200 bg-white"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  {crm && !isPending ? (
                    <>
                      Member since:{" "}
                      <span className="font-semibold text-gray-900">
                        {formatDate(crm.createdAt)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">Loading...</span>
                  )}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#dfa974" }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export default CRMDetailsModal;
