import React, { useEffect, useState } from "react";
import usePaymentStore from "../../stores/PaymentStore";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "./useCreatePaymentIntent";
import CheckOutForm from "./CheckOutForm";
import toast from "react-hot-toast";

function Payments({ bookingId = "6821b04ade325bf5dd647b4e" }) {
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
    if (bookingId) {
      paymentIntent(bookingId);
    }
  }, [bookingId, paymentIntent]);

  // Extract payment intent ID from the client secret response
  useEffect(() => {
    if (clientSecret?.paymentIntentId) {
      setPaymentIntentId(clientSecret.paymentIntentId);
    }
  }, [clientSecret, setPaymentIntentId]);

  // Show loading state if anything is still loading
  if (isLoadingKey || isPendingPaymentIntent || !stripePromise) {
    return (
      <div className="payment-loading">
        <h1>Preparing Payment...</h1>
        <LoadingSpinner />
      </div>
    );
  }

  // Show error if payment intent creation failed
  if (errorPaymentIntent) {
    return (
      <div className="payment-error">
        <h1>Payment Setup Failed</h1>
        <p>We couldn't set up your payment. Please try again later.</p>
        <p className="error-message">{errorPaymentIntent.message}</p>
      </div>
    );
  }

  // Don't render Elements if we don't have a client secret
  if (!clientSecret?.clientSecret) {
    return (
      <div className="payment-error">
        <p>Payment setup incomplete. Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h1>Complete Your Payment</h1>

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
        <CheckOutForm paymentIntentId={clientSecret.paymentIntentId} />
      </Elements>
    </div>
  );
}

export default Payments;
