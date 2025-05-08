import React, { useEffect } from "react";
import usePaymentStore from "../../stores/PaymentStore";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "./useCreatePaymentIntent";
import CheckOutForm from "./CheckOutForm";

const pk =
  "pk_test_51NYpWcDQYXmxwuNk08FZtOQ8ftYlHxl2tDEmi9ieSMpZysSDwMICIxGX2PykJvtegXLwYwy0iE0Cf1iz6FRkQ6iR00E3pJaRVU";

function Payments({ bookingId = "681c639f87604016c1603533" }) {
  const stripePromise = loadStripe(pk);
  const {
    paymentIntent,
    error: errorPaymentIntent,
    isPending: isPendingPaymentIntent,
  } = useCreatePaymentIntent();

  const clientSecret = usePaymentStore((state) => state.clientSecret);

  useEffect(() => {
    paymentIntent(bookingId);
  }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {isPendingPaymentIntent ? (
        <LoadingSpinner />
      ) : (
        clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: clientSecret.clientSecret,
              appearance: {
                theme: "stripe",
                // Additional styling options
              },
            }}
          >
            <CheckOutForm />
          </Elements>
        )
      )}
    </>
  );
}

export default Payments;
