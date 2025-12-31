"use client";

import Loading from "@/components/Loading";
import BillingHistory from "@/components/search/residence/BillingHistory";
import PaymentMethod from "@/components/search/residence/PaymentMethod";
import ResidenceCard from "@/components/search/residence/ResidenceCard";
import { useGetAuthUserQuery } from "@/state/api";
import { useGetLeasesQuery, useGetPaymentsQuery } from "@/state/leases-api";
import { useGetPropertyQuery } from "@/state/properties-api";
import { useParams } from "next/navigation";

const ResidencePage = () => {
  const { id } = useParams();
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: property,
    isLoading: propertyLoading,
    error: propertyError,
  } = useGetPropertyQuery(Number(id));
  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(
    parseInt(authUser?.cognitoInfo.userId || "0"),
    { skip: !authUser }
  );

  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(
    leases?.[0]?.id || 0,
    { skip: !leases }
  );

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;
  if (propertyError) return <div>Error loading property.</div>;
  const currentLease = leases?.find(
    (lease) => lease.propertyId === property?.id
  );

  return (
    <div className="pt-8 pb-5 px-8 w-full">
      <div className="w-full mx-auto">
        <div className="md:flex gap-10">
          {currentLease && (
            <ResidenceCard property={property} currentLease={currentLease} />
          )}
          <PaymentMethod />
        </div>
        <BillingHistory payments={payments || []} />
      </div>
    </div>
  );
};

export default ResidencePage;
