import React, { useEffect, useState } from "react";
import usePaymentStore from "../../stores/PaymentStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "./useCreatePaymentIntent";
import CheckOutForm from "./CheckOutForm";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

function PaymentModal({ isOpen, onClose, bookingId }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [isLoadingKey, setIsLoadingKey] = useState(true);

  const {
    paymentIntent,
    error: errorPaymentIntent,
    isPending: isPendingPaymentIntent,
  } = useCreatePaymentIntent();

  // Use separate selectors to avoid creating new objects on every render
  const clientSecret = usePaymentStore((state) => state.clientSecret);
  const setPaymentIntentId = usePaymentStore(
    (state) => state.setPaymentIntentId
  );

  // Load Stripe publishable key
  useEffect(() => {
    async function loadStripeKey() {
      try {
        setIsLoadingKey(true);
        const publishableKey =
          "pk_test_51NYpWcDQYXmxwuNk08FZtOQ8ftYlHxl2tDEmi9ieSMpZysSDwMICIxGX2PykJvtegXLwYwy0iE0Cf1iz6FRkQ6iR00E3pJaRVU";
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        toast.error("Failed to load Stripe: " + error.message);
      } finally {
        setIsLoadingKey(false);
      }
    }

    loadStripeKey();
  }, []);

  // Create payment intent when component mounts
  useEffect(() => {
    if (bookingId && isOpen) {
      paymentIntent(bookingId);
    }
  }, [bookingId, paymentIntent, isOpen]);

  // Extract payment intent ID from the client secret response
  useEffect(() => {
    if (clientSecret?.paymentIntentId) {
      setPaymentIntentId(clientSecret.paymentIntentId);
    }
  }, [clientSecret, setPaymentIntentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="mt-3">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Complete Your Payment
            </h3>

            {isLoadingKey || isPendingPaymentIntent || !stripePromise ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-500">
                  Preparing Payment...
                </p>
              </div>
            ) : errorPaymentIntent ? (
              <div className="text-center py-4">
                <p className="text-red-600">Payment Setup Failed</p>
                <p className="text-sm text-gray-500 mt-2">
                  {errorPaymentIntent.message}
                </p>
              </div>
            ) : !clientSecret?.clientSecret ? (
              <div className="text-center py-4">
                <p className="text-red-600">
                  Payment setup incomplete. Please try again.
                </p>
              </div>
            ) : (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: clientSecret.clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#6772e5",
                      colorBackground: "#ffffff",
                      colorText: "#32325d",
                      colorDanger: "#ff4136",
                      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                      spacingUnit: "4px",
                      borderRadius: "4px",
                    },
                  },
                }}
              >
                <CheckOutForm
                  paymentIntentId={clientSecret.paymentIntentId}
                  onSuccess={onClose}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
