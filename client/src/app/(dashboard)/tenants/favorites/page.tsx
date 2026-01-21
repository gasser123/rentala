"use client";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import PropertyCard from "@/components/search/PropertyCard";
import { useGetAuthUserQuery } from "@/state/api";
import { useGetPropertiesQuery } from "@/state/properties-api";
import { useGetTenantQuery } from "@/state/tenants-api";

const FavoritesPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo.userId || "",
    { skip: !authUser }
  );

  const {
    data: favoriteProperties,
    error,
    isLoading,
  } = useGetPropertiesQuery(
    {
      favoriteIds: tenant?.favorites.map((fav: { id: number }) => fav.id),
    },
    {
      skip: !tenant || tenant.favorites.length === 0,
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading favorites</div>;

  return (
    <div className="pt-8 pb-5 px-8 w-full">
      <Header
        title="Favorited Properties"
        subtitle="Browse and manage your saved properties"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProperties && favoriteProperties.length > 0 ? (
          favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={true}
              onFavoriteToggle={() => {}}
              showFavoriteButton={false}
              propertyLink={`/tenants/residences/${property.id}`}
            />
          ))
        ) : (
          <p>No favorite properties yet.</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
