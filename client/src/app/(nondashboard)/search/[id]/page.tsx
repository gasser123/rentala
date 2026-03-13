"use client";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ContactWidget from "@/components/search/listings/ContactWidget";
import ImagePreviews from "@/components/search/listings/ImagePreviews";
import PropertyDetails from "@/components/search/listings/PropertyDetails";
import PropertyLocation from "@/components/search/listings/PropertyLocation";
import PropertyOverview from "@/components/search/listings/PropertyOverview";
import { useGetAuthUserQuery } from "@/state/api";
import { useGetPropertyQuery } from "@/state/properties-api";
import { useParams } from "next/navigation";
import { useState } from "react";

const SingleListingPage = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const { data: authUser } = useGetAuthUserQuery();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    data: property,
    isLoading: propertyLoading,
    error: propertyError,
  } = useGetPropertyQuery(Number(id));

  if (propertyError) {
    return (
      <div className="text-center mt-20 text-red-500">
        Failed to load property details. Please try again later.
      </div>
    );
  }

  if (propertyLoading) {
    return <div className="text-center mt-20">Loading property details...</div>;
  }
  return (
    <div>
      <ImagePreviews images={property?.photoUrls} />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>
        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
        {authUser && (
          <ApplicationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            propertyId={propertyId}
          />
        )}
      </div>
    </div>
  );
};

export default SingleListingPage;
