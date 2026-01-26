import { Application, Lease } from "@/types/prismaTypes";
import { api } from "./api";
import { withToast } from "@/lib/utils";

export const applicationsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<
      Application[],
      { userId?: string; userType?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.userId) {
          queryParams.append("userId", params.userId);
        }
        if (params.userType) {
          queryParams.append("userType", params.userType);
        }
        return `/applications?${queryParams.toString()}`;
      },
      providesTags: ["Application"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch applications.",
        });
      },
    }),
    updateApplicationStatus: builder.mutation<
      Application & { lease?: Lease },
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Application", "Lease"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to update application status",
          success: "Application status updated successfully",
        });
      },
    }),
    createApplication: builder.mutation<Application, Partial<Application>>({
      query: (applicationData) => ({
        url: `/applications`,
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Application"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to create application",
          success: "Application created successfully",
        });
      },
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
} = applicationsApiSlice;
