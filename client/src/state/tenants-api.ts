import { Property, Tenant } from "@/types/prismaTypes";
import { api } from "./api";

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
    }),
    getTenant: builder.query<Tenant, string>({
      query: (cognitoId) => {
        return { url: `/tenants/${cognitoId}` };
      },
      providesTags: (result) => [{ type: "Tenant", id: result?.id }],
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
