import { Application, Lease } from "@/types/prismaTypes";
import { api } from "./api";

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
    }),
    createApplication: builder.mutation<Application, Partial<Application>>({
      query: (applicationData) => ({
        url: `/applications`,
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
} = applicationsApiSlice;
