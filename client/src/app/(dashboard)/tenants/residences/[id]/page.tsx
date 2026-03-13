"use client";

import Loading from "@/components/Loading";
import BillingHistory from "@/components/search/residence/BillingHistory";
import PaymentMethod from "@/components/search/residence/PaymentMethod";
import ResidenceCard from "@/components/search/residence/ResidenceCard";
import { useGetAuthUserQuery } from "@/state/api";
import {
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery,
} from "@/state/leases-api";
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
  const { data: leases, isLoading: leasesLoading } = useGetPropertyLeasesQuery(
    property?.id || 0,
    { skip: !property || !authUser },
  );

  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(
    leases && leases.length > 0 ? leases[0].id : undefined,
    { skip: !leases || leases.length === 0 },
  );

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;
  if (propertyError) return <div>Error loading property.</div>;
  const currentLease = leases?.find(
    (lease) => lease.propertyId === property?.id,
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
