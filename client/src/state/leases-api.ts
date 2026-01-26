import { Lease, Payment } from "@/types/prismaTypes";
import { api } from "./api";
import { withToast } from "@/lib/utils";

export const leasesApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeases: builder.query<Lease[], number>({
      query: () => "/leases",
      providesTags: ["Lease"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch leases",
        });
      },
    }),
    getPayments: builder.query<Payment[], number>({
      query: (leaseId) => `/leases/${leaseId}/payments`,
      providesTags: ["Payment"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payments.",
        });
      },
    }),
    getPropertyLeases: builder.query<Lease[], number>({
      query: (propertyId) => `/properties/${propertyId}/leases`,
      providesTags: ["Lease"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property leases",
        });
      },
    }),
  }),
});

export const {
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery,
} = leasesApiSlice;
