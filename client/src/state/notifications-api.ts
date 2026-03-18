import { Notification } from "@/types/prismaTypes";
import { api } from "./api";
import { withToast } from "@/lib/utils";

export const notificationsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch notifications",
        });
      },
      providesTags: ["Notification"],
    }),
    updateNotificationStatus: builder.mutation<{ message: string }, number>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to update notification status.",
        });
      },
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useUpdateNotificationStatusMutation } =
  notificationsApiSlice;
