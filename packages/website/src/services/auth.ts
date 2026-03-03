import {
  queryOptions,
  type MutateOptions,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { service } from "@/services/index";
import { SignInRequest, type UserType } from "@root/database/types";

export const signInOptions = (
  params?: Omit<MutateOptions<UserType, void, SignInRequest>, "mutationFn">,
): UseMutationOptions<UserType, void, SignInRequest> => {
  return {
    ...params,
    mutationFn: async (data: SignInRequest): Promise<UserType> =>
      service<UserType, SignInRequest>({
        method: "POST",
        url: "auth",
        data,
      }),
  };
};

export const authOptions = (
  token: null | string,
  params?: Omit<UseQueryOptions<UserType>, "queryKey" | "queryFn">,
) => {
  return queryOptions({
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    meta: { persist: true },
    ...params,
    queryKey: ["auth"],
    queryFn: () =>
      service<UserType>({
        method: "GET",
        url: "auth",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
