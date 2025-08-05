/* eslint-disable @typescript-eslint/no-explicit-any */
// simplified-tanstack-helpers.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryClient,
} from "@tanstack/react-query";
import AxiosHelper from "./axios";

// Create an API instance with your base URL
const api = new AxiosHelper();

// Type definitions
interface QueryParams {
  [key: string]: any;
}

interface UpdateVariables {
  id: string | number;
  data: any;
}

interface LoadingState {
  isLoading: boolean;
}

// Utility type to omit conflicting properties from options
type QueryOptionsWithoutConflicts<T> = Omit<
  UseQueryOptions<T, Error, T, any[]>,
  "queryKey" | "queryFn" | "enabled"
>;

type MutationOptionsWithoutConflicts<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn" | "onSuccess"
> & {
  onSuccess?: () => void;
};

/**
 * Simple hooks for fetching data with TanStack Query
 */
export const useFetch = <T = any>(
  endpoint: string,
  params: QueryParams = {},
  options: QueryOptionsWithoutConflicts<T> = {}
) => {
  return useQuery<T, Error, T, any[]>({
    // The queryKey is what TanStack uses to cache and identify this query
    queryKey: [endpoint, params],
    // The actual function that fetches data
    queryFn: () => api.getAll<T>(endpoint, params),
    ...options,
  });
};

/**
 * Fetch a single item by ID
 */
export const useFetchById = <T = any>(
  endpoint: string,
  id: string | number | null | undefined,
  options: QueryOptionsWithoutConflicts<T> = {}
) => {
  return useQuery<T, Error, T, any[]>({
    queryKey: [endpoint.replace(":id", String(id || "")), id],
    queryFn: () => api.getById<T>(endpoint, id!),
    // Only run the query if we have an ID
    enabled: !!id,
    ...options,
  });
};

/**
 * Create a new item
 */
export const useCreate = <TData = any, TVariables = any>(
  endpoint: string,
  options: MutationOptionsWithoutConflicts<TData, TVariables> = {}
) => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) =>
      api.create<TData, TVariables>(endpoint, data),
    onSuccess: () => {
      // After creating, refresh any queries for this endpoint
      queryClient.invalidateQueries({ queryKey: [endpoint] });

      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    ...options,
  });
};

/**
 * Update an existing item
 */
export const useUpdate = <TData = any, TUpdateData = any>(
  endpoint: string,
  options: MutationOptionsWithoutConflicts<TData, UpdateVariables> = {}
) => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<TData, Error, UpdateVariables>({
    mutationFn: ({ id, data }: UpdateVariables) =>
      api.update<TData, TUpdateData>(endpoint, id, data as TUpdateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [endpoint, variables.id] });
      queryClient.invalidateQueries({ queryKey: [`${endpoint}/`] });

      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    ...options,
  });
};

/**
 * Delete an item
 */
export const useDelete = <TData = any>(
  endpoint: string,
  options: MutationOptionsWithoutConflicts<TData, string | number> = {}
) => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation<TData, Error, string | number>({
    mutationFn: (id: string | number) => api.delete<TData>(endpoint, id),
    onSuccess: () => {
      // After deleting, refresh queries for this endpoint
      queryClient.invalidateQueries({ queryKey: [`${endpoint}/`] });

      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    ...options,
  });
};

/**
 * Custom hook that adapts
 */
export const useFetchCustom = <T = any>(
  endpoint: string,
  options: QueryOptionsWithoutConflicts<T> = {}
) => {
  const key: string = endpoint.split(".")[0].slice(8, 22);
  return useQuery<T, Error, T, any[]>({
    queryKey: [key],
    queryFn: () => api.customGet<T>(endpoint),
    ...options,
  });
};

/**
 * For checking loading state across the app
 */
export const useLoadingState = (): LoadingState => {
  const queryClient: QueryClient = useQueryClient();
  return {
    isLoading: queryClient.isFetching() > 0 || queryClient.isMutating() > 0,
  };
};

export default {
  useFetch,
  useFetchById,
  useCreate,
  useUpdate,
  useDelete,
  useFetchCustom,
  useLoadingState,
};
