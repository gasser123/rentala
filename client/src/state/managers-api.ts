import { Manager, Property } from "@/types/prismaTypes";
import { api } from "./api";
import { withToast } from "@/lib/utils";

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
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to update settings",
          success: "Settings updated successfully",
        });
      },
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
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch properties",
        });
      },
    }),
  }),
});

export const {
  useUpdateManagerSettingsMutation,
  useGetManagerPropertiesQuery,
} = managersApiSlice;
