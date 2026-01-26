import { Property, Tenant } from "@/types/prismaTypes";
import { api } from "./api";
import { withToast } from "@/lib/utils";

export const tenantsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateTenantSettings: builder.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `/tenants/${cognitoId}`,
        method: "PUT",
        body: updatedTenant,
      }),
      invalidatesTags: ({ result }) => [{ type: "Tenant", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to update tenant settings",
          success: "Settings updated successfully",
        });
      },
    }),
    addFavoriteProperty: builder.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `/tenants/${cognitoId}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: ({ result }) => [
        { type: "Tenant", id: result?.id },
        { type: "Property", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to add favorite property",
          success: "Property added to favorites",
        });
      },
    }),
    removeFavoriteProperty: builder.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `/tenants/${cognitoId}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ({ result }) => [
        { type: "Tenant", id: result?.id },
        { type: "Property", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to remove favorite property",
          success: "Property removed from favorites",
        });
      },
    }),
    getTenant: builder.query<Tenant, string>({
      query: (cognitoId) => {
        return { url: `/tenants/${cognitoId}` };
      },
      providesTags: (result) => [{ type: "Tenant", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch tenant details",
        });
      },
    }),
    getCurrentResidences: builder.query<Property[], string>({
      query: (cognitoId) => {
        return { url: `/tenants/${cognitoId}/current-residences` };
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
          error: "Failed to fetch current residences",
        });
      },
    }),
  }),
});

export const {
  useUpdateTenantSettingsMutation,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetTenantQuery,
  useGetCurrentResidencesQuery,
} = tenantsApiSlice;
