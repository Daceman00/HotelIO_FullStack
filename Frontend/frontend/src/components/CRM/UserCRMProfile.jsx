import React from "react";
import { useGetCRMProfile } from "./useGetMyCrm";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { createPortal } from "react-dom";

function UserCRMProfile() {
  const { crm, isPending, error } = useGetCRMProfile();

  if (isPending) return <LoadingSpinner />;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          style={{ backgroundColor: "#dfa974" }}
        >
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">My Profile</h2>
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
          {isPending && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#dfa974] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your profile...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 font-semibold mb-2">
                Error loading your profile
              </p>
              <p className="text-red-600 text-sm">{error.message}</p>
            </div>
          )}

          {/* Data Display */}
          {crm && !isPending && !error && (
            <>
              {/* Profile Header with Avatar */}
              <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                      style={{ backgroundColor: "#dfa974" }}
                    >
                      {crm.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    {crm.isVIP && (
                      <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {crm.user?.name || "Guest Name"}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-3">
                      <Mail className="w-4 h-4" />
                      <p>{crm.user?.email || "guest@example.com"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTierColor(
                          crm.loyaltyTier
                        )}`}
                      >
                        {crm.loyaltyTier?.toUpperCase() || "BRONZE"} MEMBER
                      </span>
                      {crm.isVIP && (
                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 border border-purple-300">
                          VIP
                        </span>
                      )}
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                        {crm.guestStatus?.toUpperCase() || "NEW"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Stay History */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: "#dfa974" }} />
                  Your Stay History
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={Calendar}
                    label="Total Stays"
                    value={crm.stayStatistics?.totalStays || 0}
                    subtext="bookings completed"
                  />
                  <StatCard
                    icon={Clock}
                    label="Total Nights"
                    value={crm.stayStatistics?.totalNights || 0}
                    subtext="nights with us"
                  />
                  <StatCard
                    icon={DollarSign}
                    label="Total Spent"
                    value={`$${crm.stayStatistics?.lifetimeValue || 0}`}
                    subtext="lifetime value"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Average Stay"
                    value={`${crm.stayStatistics?.averageStayLength || 0}`}
                    subtext="nights per visit"
                  />
                </div>
                {crm.stayStatistics?.lastStayDate && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Your last visit:{" "}
                      <span className="font-semibold text-gray-900">
                        {formatDate(crm.stayStatistics.lastStayDate)}
                      </span>
                    </p>
                    {crm.daysSinceLastStay !== null && (
                      <p className="text-sm text-gray-600 mt-1">
                        That was {crm.daysSinceLastStay} days ago. We hope to
                        see you again soon!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Loyalty Rewards */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: "#dfa974" }} />
                  Your Rewards & Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Points Card */}
                  <div
                    className="bg-gradient-to-br from-white to-amber-50 rounded-lg p-6 shadow-sm border-2"
                    style={{ borderColor: "#dfa974" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Your Points</p>
                        <p
                          className="text-4xl font-bold"
                          style={{ color: "#dfa974" }}
                        >
                          {crm.loyaltyPoints || 0}
                        </p>
                      </div>
                      <Award
                        className="w-16 h-16"
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
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
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
                      <p className="text-sm text-gray-600">
                        <span
                          className="font-semibold"
                          style={{ color: "#dfa974" }}
                        >
                          {crm.pointsToNextTier || 0} more points
                        </span>{" "}
                        to reach {crm.nextTier?.toUpperCase()} tier!
                      </p>
                    </div>
                  </div>

                  {/* Referral Card */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Your Referral Code
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xl font-bold text-gray-900">
                            {crm.referralCode || "N/A"}
                          </p>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(crm.referralCode)
                            }
                            className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
                            style={{ color: "#dfa974" }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <Users
                        className="w-12 h-12"
                        style={{ color: "#dfa974", opacity: 0.2 }}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        Share your code and earn rewards!
                      </p>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-600">Friends Invited:</span>
                        <span className="font-semibold text-gray-900">
                          {crm.referralsMade || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Successful Referrals:
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: "#dfa974" }}
                        >
                          {crm.successfulReferrals || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Active Discounts */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5" style={{ color: "#dfa974" }} />
                  Your Active Discounts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {crm.activeDiscounts?.length > 0 ? (
                    crm.activeDiscounts.map((discount) => (
                      <div
                        key={discount.id}
                        className="bg-gradient-to-r from-white to-amber-50 rounded-lg p-5 shadow-sm border-2"
                        style={{ borderColor: "#dfa974" }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Gift
                                className="w-5 h-5"
                                style={{ color: "#dfa974" }}
                              />
                              <p className="font-bold text-gray-900 text-lg">
                                {discount.code}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {discount.description}
                            </p>
                          </div>
                          <span
                            className="px-4 py-2 rounded-full text-lg font-bold text-white ml-2"
                            style={{ backgroundColor: "#dfa974" }}
                          >
                            {discount.type === "percentage"
                              ? `${discount.value}%`
                              : `$${discount.value}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
                          <span className="text-gray-600">
                            Min. {discount.minimumStayNights} night(s)
                          </span>
                          <span className="text-gray-600">
                            Expires: {formatDate(discount.expiresAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
                      <Gift className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 text-lg mb-1">
                        No active discounts
                      </p>
                      <p className="text-sm text-gray-400">
                        Check back later for exclusive offers!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Your Preferences */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bed className="w-5 h-5" style={{ color: "#dfa974" }} />
                  Your Preferences
                </h4>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Preferred Room Type
                      </p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
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
                                className="px-3 py-1.5 bg-amber-50 text-gray-700 text-sm rounded-full border"
                                style={{ borderColor: "#dfa974" }}
                              >
                                <Coffee className="w-3 h-3 inline mr-1" />
                                {amenity}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No amenities selected yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Reviews */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" style={{ color: "#dfa974" }} />
                  Your Reviews
                </h4>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center">
                      <div
                        className="text-5xl font-bold mb-2"
                        style={{ color: "#dfa974" }}
                      >
                        {crm.reviewStatistics?.averageRating?.toFixed(1) ||
                          "0.0"}
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-5 h-5"
                            fill={
                              star <= (crm.reviewStatistics?.averageRating || 0)
                                ? "#dfa974"
                                : "none"
                            }
                            style={{ color: "#dfa974" }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Your Average Rating
                      </p>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-gray-900">
                            {crm.reviewStatistics?.totalReviews || 0}
                          </p>
                          <p className="text-xs text-gray-600">Total Reviews</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p
                            className="text-2xl font-bold"
                            style={{ color: "#dfa974" }}
                          >
                            {crm.positiveReviewPercentage || 0}%
                          </p>
                          <p className="text-xs text-gray-600">Positive</p>
                        </div>
                      </div>
                      {crm.reviewStatistics?.lastReviewDate && (
                        <p className="text-sm text-gray-600 text-center">
                          Last review:{" "}
                          {formatDate(crm.reviewStatistics.lastReviewDate)}
                        </p>
                      )}
                    </div>
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
                  Member since{" "}
                  <span className="font-semibold text-gray-900">
                    {formatDate(crm.createdAt)}
                  </span>{" "}
                  • Thank you for being with us!
                </>
              ) : (
                <span className="text-gray-400">
                  <LoadingSpinner />
                </span>
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

export default UserCRMProfile;
