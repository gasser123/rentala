"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import PropertyCard from "@/components/search/PropertyCard";
import { useGetAuthUserQuery } from "@/state/api";
import {
  useGetCurrentResidencesQuery,
  useGetTenantQuery,
} from "@/state/tenants-api";

const ResidencesPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo.userId || "",
    { skip: !authUser }
  );

  const {
    data: currentResidences,
    error,
    isLoading,
  } = useGetCurrentResidencesQuery(authUser?.cognitoInfo.userId || "", {
    skip: !authUser,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading current residences</div>;

  return (
    <div className="pt-8 pb-5 px-8 w-full">
      <Header
        title="Current Residences"
        subtitle="View and manage your current living spaces"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentResidences && currentResidences.length > 0 ? (
          currentResidences.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={tenant?.favorites.includes(property.id) || false}
              onFavoriteToggle={() => {}}
              showFavoriteButton={false}
              propertyLink={`/tenants/residences/${property.id}`}
            />
          ))
        ) : (
          <p>No residences yet.</p>
        )}
      </div>
    </div>
  );
};

export default ResidencesPage;
