import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useProcessPayment } from "./useProcessPayment";
import { useConfirmPayment } from "./useConfirmPayment";

function CheckOutForm({ paymentIntentId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    processPayment: processPaymentMutation,
    isPending: isProcessingPayment,
  } = useProcessPayment();
  const { confirmPayment, isPending: isConfirmingPayment } =
    useConfirmPayment();

  // Handle required action for authentication challenges
  const handleRequiredAction = async (clientSecret) => {
    setMessage("Additional authentication required...");

    try {
      const { error } = await stripe.handleCardAction(clientSecret);

      if (error) {
        setMessage(`Authentication failed: ${error.message}`);
        setIsProcessing(false);
        return;
      }

      // After authentication, create a new payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(PaymentElement),
        });

      if (paymentMethodError) {
        setMessage(
          `Payment method creation failed: ${paymentMethodError.message}`
        );
        setIsProcessing(false);
        return;
      }

      // Process payment with the new payment method
      processPaymentMutation(
        {
          paymentIntentId,
          paymentMethodId: paymentMethod.id,
        },
        {
          onSuccess: () => {
            toast.success("Payment successful!");
            onSuccess?.();
          },
          onError: (error) => {
            setMessage(`Payment failed: ${error.message}`);
            toast.error(`Payment failed: ${error.message}`);
            setIsProcessing(false);
          },
        }
      );
    } catch (err) {
      setMessage("Authentication failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("Processing payment...");

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
        toast.error(`Payment failed: ${error.message}`);
        setIsProcessing(false);
      } else {
        // Call confirmPayment and handle the response
        const result = await confirmPayment(paymentIntentId);

        if (result?.requiresAction && result?.clientSecret) {
          // Handle 3D Secure or other required actions
          await handleRequiredAction(result.clientSecret);
        } else if (result?.paymentStatus === "succeeded") {
          // Payment succeeded
          toast.success("Payment successful!");
          onSuccess?.();
        }
        setIsProcessing(false);
        setMessage(null);
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  const isLoading = isProcessing || isProcessingPayment || isConfirmingPayment;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement id="payment-element" />

      <button
        disabled={isLoading || !stripe || !elements}
        className={`
          w-full mt-5 px-4 py-3 text-white font-medium rounded-md
          transition-colors duration-200 ease-in-out
          ${
            isLoading || !stripe || !elements
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          "Pay Now"
        )}
      </button>

      {message && <div className="mt-3 text-sm text-red-600">{message}</div>}
    </form>
  );
}

export default CheckOutForm;
