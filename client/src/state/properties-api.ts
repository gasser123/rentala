import { Property } from "@/types/prismaTypes";
import { api } from "./api";
import { FiltersState } from ".";
import { cleanParams, withToast } from "@/lib/utils";

export const propertiesApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query<
      Property[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });
        return { url: "/properties", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Property" as const, id })),
              { type: "Property", id: "LIST" },
            ]
          : [{ type: "Property", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch properties",
        });
      },
    }),
    getProperty: builder.query<Property, number>({
      query: (propertyId) => {
        return { url: `/properties/${propertyId}` };
      },
      providesTags: (result, error, id) => [{ type: "Property", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property details",
        });
      },
    }),
    createProperty: builder.mutation<Property, FormData>({
      query: (newProperty) => ({
        url: `/properties`,
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: ({ result }) => [
        { type: "Property", id: "LIST" },
        { type: "Manager", id: result?.manager.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to create property",
          success: "Property created successfully",
        });
      },
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
} = propertiesApiSlice;
