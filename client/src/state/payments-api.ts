import { api } from "./api";
import { withToast } from "@/lib/utils";

export const paymentsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createCheckOutSession: builder.mutation<{ clientSecret: string }, number>({
      query: (applicationId) => ({
        url: `/payments/create-checkout-session?applicationId=${applicationId}`,
        method: "POST",
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to create checkout session.",
        });
      },
    }),
    getCheckOutSessionStatus: builder.query<
      { status: "open" | "complete" | "expired" },
      string
    >({
      query: (sessionId) => `/payments/session-status?sessionId=${sessionId}`,
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch checkout session status.",
        });
      },
    }),
  }),
});

export const {
  useCreateCheckOutSessionMutation,
  useGetCheckOutSessionStatusQuery,
} = paymentsApiSlice;
