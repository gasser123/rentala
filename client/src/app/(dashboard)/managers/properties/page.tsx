"use client";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import PropertyCard from "@/components/search/PropertyCard";
import { useGetAuthUserQuery } from "@/state/api";
import { useGetManagerPropertiesQuery } from "@/state/managers-api";

const ManagerPropertiesPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    error,
    isLoading,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo.userId || "", {
    skip: !authUser,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading properties</div>;

  return (
    <div className="pt-8 pb-5 px-8 w-full">
      <Header
        title="My Properties"
        subtitle="View and manage your properties"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties && managerProperties.length > 0 ? (
          managerProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={false}
              onFavoriteToggle={() => {}}
              showFavoriteButton={false}
              propertyLink={`/managers/properties/${property.id}`}
            />
          ))
        ) : (
          <p>No added properties yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerPropertiesPage;
