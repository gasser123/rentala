import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant } from "@/types/prismaTypes";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
    },
  }),
  reducerPath: "api",
  tagTypes: ["Manager", "Tenant"],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          if (!idToken) {
            return {
              error: {
                error: "user is not authenticated",
                originalStatus: 401,
                status: 401,
                data: {},
              },
            };
          }
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;
          const endpoint =
            userRole === "manager"
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;
          let userDetailsResponse = await fetchWithBQ(endpoint);

          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            userDetailsResponse = await createNewUserInDatabase(
              user,
              idToken as { payload: { email?: string } } | null,
              userRole,
              fetchWithBQ as ({
                url,
                method,
                body,
              }: {
                url: string;
                method: string;
                body: {
                  cognitoId: string;
                  name: string;
                  email: string;
                  phoneNumber: string;
                };
              }) => Promise<
                QueryReturnValue<
                  unknown,
                  FetchBaseQueryError,
                  FetchBaseQueryMeta
                >
              >
            );
          }
          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error) {
          return {
            error: error as FetchBaseQueryError,
          };
        }
      },
    }),
  }),
});

export const { useGetAuthUserQuery } = api;
