import { Manager } from "@/types/prismaTypes";
import { api } from "./api";

export const managersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateManagerSettings: builder.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `/managers/${cognitoId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: ({ result }) => [{ type: "Manager", id: result?.id }],
    }),
  }),
});

export const { useUpdateManagerSettingsMutation } = managersApiSlice;
