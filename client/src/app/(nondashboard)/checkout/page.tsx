"use client";
import Checkout from "@/components/checkout/Checkout";
import { useCreateCheckOutSessionMutation } from "@/state/payments-api";
import { Loader } from "@aws-amplify/ui-react";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  if (!applicationId) {
    notFound();
  }
  const [
    createCheckoutSession,
    {
      data: checkoutSessionData,
      isLoading: isCreatingCheckoutSession,
      error: createCheckoutSessionError,
    },
  ] = useCreateCheckOutSessionMutation();

  useEffect(() => {
    const initiateCheckout = async () => {
      await createCheckoutSession(Number(applicationId));
    };
    initiateCheckout();
  }, [createCheckoutSession, applicationId]);
  if (createCheckoutSessionError) {
    console.error(
      "Error creating checkout session:",
      createCheckoutSessionError,
    );
    return (
      <div className="flex flex-col justify-center items-center">
        <h2>Error Creating Checkout Session</h2>
        <div>Something went wrong while creating the checkout session.</div>
      </div>
    );
  }

  if (isCreatingCheckoutSession || !checkoutSessionData) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader className="w-10! h-10!" />
      </div>
    );
  }

  return <Checkout clientSecret={checkoutSessionData.clientSecret} />;
};

export default CheckoutPage;
