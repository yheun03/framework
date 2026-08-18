import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { getRequestURL } from 'h3';

type RequestConfig = AxiosRequestConfig;
type FetchResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type RequestBody = Record<string, unknown> | BodyInit | null;

export type ApiClient = {
    get: <T>(url: string, config?: RequestConfig) => Promise<T>;
    post: <T, B = RequestBody>(url: string, body?: B, config?: RequestConfig) => Promise<T>;
    put: <T, B = RequestBody>(url: string, body?: B, config?: RequestConfig) => Promise<T>;
    patch: <T, B = RequestBody>(url: string, body?: B, config?: RequestConfig) => Promise<T>;
    delete: <T>(url: string, config?: RequestConfig) => Promise<T>;
};

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

async function requestByAxiosMethod<T, B = RequestBody>(api: AxiosInstance, method: RequestMethod, url: string, body?: B, config?: RequestConfig) {
    switch (method) {
        case 'GET':
            return api.get<T>(url, config);
        case 'POST':
            return api.post<T>(url, body, config);
        case 'PUT':
            return api.put<T>(url, body, config);
        case 'PATCH':
            return api.patch<T>(url, body, config);
        case 'DELETE':
            return api.delete<T>(url, config);
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const event = useRequestEvent();
    const requestUrl = event ? getRequestURL(event) : null;
    const apiBase = config.public.apiBase as string;
    const appBase = config.app.baseURL;
    const clientApiBase = apiBase.startsWith('http') || !apiBase.startsWith('/') ? apiBase : `${appBase.replace(/\/$/, '')}${apiBase}`;
    const baseURL = import.meta.client
        ? clientApiBase
        : apiBase.startsWith('http')
          ? apiBase
          : `${requestUrl?.origin ?? 'http://localhost'}${apiBase.startsWith('/') ? apiBase : `/${apiBase}`}`;

    const api: AxiosInstance = axios.create({
        baseURL,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
    });

    async function request<T, B = RequestBody>(method: RequestMethod, url: string, body?: B, requestConfig?: RequestConfig): Promise<T> {
        if (isServerLocalRequest(url)) {
            const response = await $fetch(url, {
                method,
                ...(body !== undefined ? { body: body as RequestBody } : {}),
                ...toFetchOptions(requestConfig),
            });

            return response as T;
        }

        const axiosUrl = toAxiosUrl(url);
        const { data } = await requestByAxiosMethod<T, B>(api, method, axiosUrl, body, requestConfig);

        return data;
    }

    const apiClient: ApiClient = {
        get: (url, requestConfig) => request('GET', url, undefined, requestConfig),
        post: (url, body, requestConfig) => request('POST', url, body, requestConfig),
        put: (url, body, requestConfig) => request('PUT', url, body, requestConfig),
        patch: (url, body, requestConfig) => request('PATCH', url, body, requestConfig),
        delete: (url, requestConfig) => request('DELETE', url, undefined, requestConfig),
    };

    return {
        provide: { api: apiClient },
    };
});

declare module '#app' {
    interface NuxtApp {
        $api: ApiClient;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $api: ApiClient;
    }
}
