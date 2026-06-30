import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Bathroom, BathroomInput, BathroomWithReviews, ErrorResponse, GetTopBathroomsParams, HealthStatus, ListBathroomsParams, Review, ReviewInput, Stats } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListBathroomsUrl: (params?: ListBathroomsParams) => string;
/**
 * @summary List all bathrooms
 */
export declare const listBathrooms: (params?: ListBathroomsParams, options?: RequestInit) => Promise<Bathroom[]>;
export declare const getListBathroomsQueryKey: (params?: ListBathroomsParams) => readonly ["/api/bathrooms", ...ListBathroomsParams[]];
export declare const getListBathroomsQueryOptions: <TData = Awaited<ReturnType<typeof listBathrooms>>, TError = ErrorType<unknown>>(params?: ListBathroomsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBathrooms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBathrooms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBathroomsQueryResult = NonNullable<Awaited<ReturnType<typeof listBathrooms>>>;
export type ListBathroomsQueryError = ErrorType<unknown>;
/**
 * @summary List all bathrooms
 */
export declare function useListBathrooms<TData = Awaited<ReturnType<typeof listBathrooms>>, TError = ErrorType<unknown>>(params?: ListBathroomsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBathrooms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateBathroomUrl: () => string;
/**
 * @summary Add a new bathroom
 */
export declare const createBathroom: (bathroomInput: BathroomInput, options?: RequestInit) => Promise<Bathroom>;
export declare const getCreateBathroomMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBathroom>>, TError, {
        data: BodyType<BathroomInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBathroom>>, TError, {
    data: BodyType<BathroomInput>;
}, TContext>;
export type CreateBathroomMutationResult = NonNullable<Awaited<ReturnType<typeof createBathroom>>>;
export type CreateBathroomMutationBody = BodyType<BathroomInput>;
export type CreateBathroomMutationError = ErrorType<ErrorResponse>;
/**
* @summary Add a new bathroom
*/
export declare const useCreateBathroom: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBathroom>>, TError, {
        data: BodyType<BathroomInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBathroom>>, TError, {
    data: BodyType<BathroomInput>;
}, TContext>;
export declare const getGetTopBathroomsUrl: (params?: GetTopBathroomsParams) => string;
/**
 * @summary Get top-rated bathrooms
 */
export declare const getTopBathrooms: (params?: GetTopBathroomsParams, options?: RequestInit) => Promise<Bathroom[]>;
export declare const getGetTopBathroomsQueryKey: (params?: GetTopBathroomsParams) => readonly ["/api/bathrooms/top", ...GetTopBathroomsParams[]];
export declare const getGetTopBathroomsQueryOptions: <TData = Awaited<ReturnType<typeof getTopBathrooms>>, TError = ErrorType<unknown>>(params?: GetTopBathroomsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopBathrooms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTopBathrooms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTopBathroomsQueryResult = NonNullable<Awaited<ReturnType<typeof getTopBathrooms>>>;
export type GetTopBathroomsQueryError = ErrorType<unknown>;
/**
 * @summary Get top-rated bathrooms
 */
export declare function useGetTopBathrooms<TData = Awaited<ReturnType<typeof getTopBathrooms>>, TError = ErrorType<unknown>>(params?: GetTopBathroomsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopBathrooms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetBathroomUrl: (id: number) => string;
/**
 * @summary Get a bathroom by ID
 */
export declare const getBathroom: (id: number, options?: RequestInit) => Promise<BathroomWithReviews>;
export declare const getGetBathroomQueryKey: (id: number) => readonly [`/api/bathrooms/${number}`];
export declare const getGetBathroomQueryOptions: <TData = Awaited<ReturnType<typeof getBathroom>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBathroom>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBathroom>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBathroomQueryResult = NonNullable<Awaited<ReturnType<typeof getBathroom>>>;
export type GetBathroomQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a bathroom by ID
 */
export declare function useGetBathroom<TData = Awaited<ReturnType<typeof getBathroom>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBathroom>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetBathroomReviewsUrl: (id: number) => string;
/**
 * @summary Get reviews for a bathroom
 */
export declare const getBathroomReviews: (id: number, options?: RequestInit) => Promise<Review[]>;
export declare const getGetBathroomReviewsQueryKey: (id: number) => readonly [`/api/bathrooms/${number}/reviews`];
export declare const getGetBathroomReviewsQueryOptions: <TData = Awaited<ReturnType<typeof getBathroomReviews>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBathroomReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBathroomReviews>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBathroomReviewsQueryResult = NonNullable<Awaited<ReturnType<typeof getBathroomReviews>>>;
export type GetBathroomReviewsQueryError = ErrorType<unknown>;
/**
 * @summary Get reviews for a bathroom
 */
export declare function useGetBathroomReviews<TData = Awaited<ReturnType<typeof getBathroomReviews>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBathroomReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateReviewUrl: (id: number) => string;
/**
 * @summary Submit a review for a bathroom
 */
export declare const createReview: (id: number, reviewInput: ReviewInput, options?: RequestInit) => Promise<Review>;
export declare const getCreateReviewMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, {
        id: number;
        data: BodyType<ReviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, {
    id: number;
    data: BodyType<ReviewInput>;
}, TContext>;
export type CreateReviewMutationResult = NonNullable<Awaited<ReturnType<typeof createReview>>>;
export type CreateReviewMutationBody = BodyType<ReviewInput>;
export type CreateReviewMutationError = ErrorType<ErrorResponse>;
/**
* @summary Submit a review for a bathroom
*/
export declare const useCreateReview: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, {
        id: number;
        data: BodyType<ReviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createReview>>, TError, {
    id: number;
    data: BodyType<ReviewInput>;
}, TContext>;
export declare const getGetStatsUrl: () => string;
/**
 * @summary Get overall app statistics
 */
export declare const getStats: (options?: RequestInit) => Promise<Stats>;
export declare const getGetStatsQueryKey: () => readonly ["/api/stats"];
export declare const getGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>;
export type GetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get overall app statistics
 */
export declare function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map