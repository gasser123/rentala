import { Tenant } from "@/types/prismaTypes";
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
  }),
});

export const { useUpdateTenantSettingsMutation } = tenantsApiSlice;
