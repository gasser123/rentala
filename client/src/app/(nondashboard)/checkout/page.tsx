import Checkout from "@/components/checkout/Checkout";
import { fetchAuthSession } from "aws-amplify/auth";
import { notFound } from "next/navigation";

const CheckoutPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { applicationId } = await searchParams;
  if (!applicationId) {
    notFound();
  }
  const ApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-checkout-session?applicationId=${applicationId}`;
  const session = await fetchAuthSession();
  const { idToken } = session.tokens ?? {};
  if (!idToken) {
    return <div>401 Unauthorized</div>;
  }
  const response = await fetch(ApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    credentials: "include",
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div>{`${response.status} ${response.statusText}`}</div>
        <div>{data.message}</div>
      </div>
    );
  }

  return <Checkout clientSecret={data.clientSecret} />;
};

export default CheckoutPage;
