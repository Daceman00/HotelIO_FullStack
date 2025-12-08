import React, { useEffect } from "react";
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          style={{ backgroundColor: "#dfa974" }}
        >
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Guest Profile Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Loading State */}
          {isPending && <LoadingSpinner />}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 font-semibold mb-2">
                Error loading guest details
              </p>
              <p className="text-red-600 text-sm">{error.message}</p>
            </div>
          )}

          {/* Data Display */}
          {crm && !isPending && !error && (
            <>
              {/* Guest Info Header */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
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
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTierColor(
                        crm.loyaltyTier
                      )}`}
                    >
                      {crm.loyaltyTier?.toUpperCase() || "BRONZE"} TIER
                    </span>
                    {crm.isVIP && (
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 border border-purple-300">
                        VIP GUEST
                      </span>
                    )}
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                      {crm.guestStatus?.toUpperCase() || "NEW"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay Statistics */}
              <div className="mb-6">
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
                  />
                  <StatCard
                    icon={Clock}
                    label="Total Nights"
                    value={crm.stayStatistics?.totalNights || 0}
                  />
                  <StatCard
                    icon={DollarSign}
                    label="Lifetime Value"
                    value={`$${crm.stayStatistics?.lifetimeValue || 0}`}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Avg Stay Length"
                    value={`${
                      crm.stayStatistics?.averageStayLength || 0
                    } nights`}
                  />
                </div>
                {crm.stayStatistics?.lastStayDate && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
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
                  </div>
                )}
              </div>

              {/* Loyalty & Rewards */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: "#dfa974" }} />
                  Loyalty & Rewards
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Points</p>
                        <p
                          className="text-3xl font-bold"
                          style={{ color: "#dfa974" }}
                        >
                          {crm.loyaltyPoints || 0}
                        </p>
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            backgroundColor: "#dfa974",
                            width: `${
                              crm.loyaltyPoints && crm.pointsToNextTier
                                ? (crm.loyaltyPoints /
                                    (crm.loyaltyPoints +
                                      crm.pointsToNextTier)) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {crm.pointsToNextTier || 0} points to next tier
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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
                        <span className="text-gray-600">Referrals Made:</span>
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
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" style={{ color: "#dfa974" }} />
                  Review Statistics
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center">
                        <div
                          className="text-4xl font-bold"
                          style={{ color: "#dfa974" }}
                        >
                          {crm.reviewStatistics?.averageRating?.toFixed(1) ||
                            "0.0"}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4"
                              fill={
                                star <=
                                (crm.reviewStatistics?.averageRating || 0)
                                  ? "#dfa974"
                                  : "none"
                              }
                              style={{ color: "#dfa974" }}
                            />
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
                            {formatDate(crm.reviewStatistics.lastReviewDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Rating Distribution
                    </p>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div
                        key={rating}
                        className="flex items-center gap-2 mb-2"
                      >
                        <span className="text-xs text-gray-600 w-8">
                          {rating} ★
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              backgroundColor: "#dfa974",
                              width: `${
                                crm.reviewStatistics?.totalReviews > 0
                                  ? ((crm.reviewStatistics
                                      ?.ratingDistribution?.[rating] || 0) /
                                      crm.reviewStatistics.totalReviews) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8 text-right">
                          {crm.reviewStatistics?.ratingDistribution?.[rating] ||
                            0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preferences & Discounts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preferences */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Bed className="w-5 h-5" style={{ color: "#dfa974" }} />
                    Guest Preferences
                  </h4>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-300"
                                >
                                  <Coffee className="w-3 h-3 inline mr-1" />
                                  {amenity}
                                </span>
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
                  </div>
                </div>

                {/* Active Discounts */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5" style={{ color: "#dfa974" }} />
                    Active Discounts
                  </h4>
                  <div className="space-y-3">
                    {crm.activeDiscounts?.length > 0 ? (
                      crm.activeDiscounts.map((discount) => (
                        <div
                          key={discount.id}
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
                            <span
                              className="px-3 py-1 rounded-full text-sm font-bold text-white"
                              style={{ backgroundColor: "#dfa974" }}
                            >
                              {discount.type === "percentage"
                                ? `${discount.value}%`
                                : `$${discount.value}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Min. {discount.minimumStayNights} night(s)
                            </span>
                            <span>
                              Expires: {formatDate(discount.expiresAt)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                        <Gift className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-gray-500">No active discounts</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
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
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#dfa974" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default CRMDetailsModal;
