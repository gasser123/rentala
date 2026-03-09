import { fetchAuthSession } from "aws-amplify/auth";
import { notFound } from "next/navigation";

const CheckoutReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { session_id } = await searchParams;

  if (!session_id) {
    notFound();
  }
  const ApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/session-status?sessionId=${session_id}`;
  const session = await fetchAuthSession();
  const { idToken } = session.tokens ?? {};
  if (!idToken) {
    return <h2>401 Unauthorized</h2>;
  }
  const response = await fetch(ApiUrl, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h2>{`${response.status} ${response.statusText}`}</h2>
        <div>{data.message}</div>
      </div>
    );
  }

  const { status } = data;
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
