import React, { useEffect } from "react";
import { useGetPublishableKey } from "./useGetPublishableKey";
import usePaymentStore from "../../stores/PaymentStore";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "./useCreatePaymentIntent";

function Payments({ bookingId }) {
  const {
    publishableKey,
    error: errorKey,
    isPending: isPendingKey,
  } = useGetPublishableKey();
  const {
    createPaymentIntent,
    error: errorPaymentIntent,
    isPending: isPendingPaymentIntent,
  } = useCreatePaymentIntent;
  const setStripePromise = usePaymentStore((state) => state.setStripePromise);
  const stripePromise = usePaymentStore((state) => state.stripePromise);
  const clientSecret = usePaymentStore((state) => state.clientSecret);

  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {isPendingKey ? (
        <LoadingSpinner />
      ) : (
        stripePromise &&
        clientSecret && (
          <Elements stripe={stripePromise} options={clientSecret}></Elements>
        )
      )}
    </>
  );
}

export default Payments;
