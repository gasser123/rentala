"use client";
import { useGetAuthUserQuery } from "@/state/api";
import { useGetPropertiesQuery } from "@/state/properties-api";
import { useAppSelector } from "@/state/redux";
import {
  useAddFavoritePropertyMutation,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/tenants-api";
import { Property } from "@/types/prismaTypes";
import { Loader } from "@aws-amplify/ui-react";
import PropertyCard from "./PropertyCard";
import PropertyCardCompact from "./PropertyCardCompact";

const Listings = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo.userId || "",
    { skip: !authUser }
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);
  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser || !tenant) return;
    const isFavorite = tenant.favorites.some(
      (fav: Property) => fav.id === propertyId
    );
    if (isFavorite) {
      await removeFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    } else {
      await addFavorite({ cognitoId: authUser.cognitoInfo.userId, propertyId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader className="w-10! h-10!" />
      </div>
    );
  }

  if (isError) {
    return <div>An unexpected error occurred</div>;
  }

  if (!properties) {
    return null;
  }
  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {properties.length}{" "}
        <span className="text-gray-700 font-normal">
          Places in {filters.location}
        </span>
      </h3>
      <div className="flex">
        <div className="p-4 w-full">
          {properties.map((property) =>
            viewMode === "grid" ? (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
              />
            ) : (
              <PropertyCardCompact
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
