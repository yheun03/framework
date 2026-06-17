/**
 * Nuxt 앱 전역 API 클라이언트를 사용하기 위한 composable 파일입니다.
 */
export function useApi() {
    const {$api} = useNuxtApp();

    return $api;
}
