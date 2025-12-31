import { Lease, Payment } from "@/types/prismaTypes";
import { api } from "./api";

export const leasesApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeases: builder.query<Lease[], number>({
      query: () => "/leases",
      providesTags: ["Lease"],
    }),
    getPayments: builder.query<Payment[], number>({
      query: (leaseId) => `/leases/${leaseId}/payments`,
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetLeasesQuery, useGetPaymentsQuery } = leasesApiSlice;
