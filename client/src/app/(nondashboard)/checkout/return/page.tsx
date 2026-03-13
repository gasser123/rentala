"use client";
import { useGetCheckOutSessionStatusQuery } from "@/state/payments-api";
import { Loader } from "@aws-amplify/ui-react";
import { notFound, useSearchParams } from "next/navigation";

const CheckoutReturnPage = () => {
  const searchParmas = useSearchParams();
  const session_id = searchParmas.get("session_id");

  if (!session_id) {
    notFound();
  }

  const {
    data: checkoutSessionStatus,
    isLoading: isCheckingSessionStatus,
    error: checkoutSessionStatusError,
  } = useGetCheckOutSessionStatusQuery(session_id);
  if (checkoutSessionStatusError) {
    console.error(
      "Error fetching checkout session status:",
      checkoutSessionStatusError,
    );
    return (
      <div className="flex flex-col justify-center items-center">
        <h2>Error Checking Checkout Session Status</h2>
        <div>
          Something went wrong while checking the checkout session status.
        </div>
      </div>
    );
  }

  if (isCheckingSessionStatus) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader className="w-10! h-10!" />
      </div>
    );
  }

  const { status } = checkoutSessionStatus!;
  if (status === "open") {
    return <h2 className="text-center">Payment Failed</h2>;
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to you.
          If you have any questions, please email{" "}
        </p>
      </section>
    );
  }
};

export default CheckoutReturnPage;
