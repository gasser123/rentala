"use client";
import ContactWidget from "@/components/search/listings/ContactWidget";
import ImagePreviews from "@/components/search/listings/ImagePreviews";
import PropertyDetails from "@/components/search/listings/PropertyDetails";
import PropertyLocation from "@/components/search/listings/PropertyLocation";
import PropertyOverview from "@/components/search/listings/PropertyOverview";
import { useGetAuthUserQuery } from "@/state/api";
import { useParams } from "next/navigation";
import { useState } from "react";

const SingleListingPage = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const { data: authUser } = useGetAuthUserQuery();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <ImagePreviews
        images={["/singlelisting-2.jpg", "/singlelisting-3.jpg"]}
      />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>
        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>
    </div>
  );
};

export default SingleListingPage;
