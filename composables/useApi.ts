/**
 * Nuxt 앱에서 공통 API 클라이언트를 사용하기 위한 composable 파일입니다.
 */
import type {AxiosRequestConfig} from 'axios';

type RequestConfig = AxiosRequestConfig;
type FetchResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function isServerLocalRequest(url: string): boolean {
    return Boolean(import.meta.server && url.startsWith('/'));
}

function toAxiosUrl(url: string): string {
    if (url === '/api') return '/';
    if (url.startsWith('/api/')) return url.slice(4);
    return url;
}

function toFetchOptions(config?: RequestConfig) {
    if (!config) return {};
    return {
        headers: config.headers as HeadersInit | undefined,
        params: config.params as Record<string, string | number | boolean> | undefined,
        responseType: config.responseType as FetchResponseType | undefined,
    };
}

export function useApi() {
    const {$api} = useNuxtApp();

    async function request<T, B = Record<string, unknown> | BodyInit | null>(
        method: RequestMethod,
        url: string,
        body?: B,
        config?: RequestConfig,
    ): Promise<T> {
        if (isServerLocalRequest(url)) {
            const response = await $fetch(url, {
                method,
                ...(body !== undefined ? {body: body as BodyInit | Record<string, unknown> | null} : {}),
                ...toFetchOptions(config),
            });
            return response as T;
        }

        const axiosUrl = toAxiosUrl(url);
        const {data} =
            method === 'GET'
                ? await $api.get<T>(axiosUrl, config)
                : method === 'POST'
                  ? await $api.post<T>(axiosUrl, body, config)
                  : method === 'PUT'
                    ? await $api.put<T>(axiosUrl, body, config)
                    : await $api.delete<T>(axiosUrl, config);

        return data;
    }

    async function get<T>(url: string, config?: RequestConfig): Promise<T> {
        return request<T>('GET', url, undefined, config);
    }

    async function post<T, B = Record<string, unknown> | BodyInit | null>(url: string, body?: B, config?: RequestConfig): Promise<T> {
        return request<T, B>('POST', url, body, config);
    }

    async function put<T, B = Record<string, unknown> | BodyInit | null>(url: string, body?: B, config?: RequestConfig): Promise<T> {
        return request<T, B>('PUT', url, body, config);
    }

    async function remove<T>(url: string, config?: RequestConfig): Promise<T> {
        return request<T>('DELETE', url, undefined, config);
    }

    return {
        get,
        post,
        put,
        delete: remove,
    };
}
