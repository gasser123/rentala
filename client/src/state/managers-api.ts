import { Manager, Property } from "@/types/prismaTypes";
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
    getManagerProperties: builder.query<Property[], string>({
      query: (cognitoId) => {
        return { url: `/managers/${cognitoId}/properties` };
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
  useUpdateManagerSettingsMutation,
  useGetManagerPropertiesQuery,
} = managersApiSlice;
