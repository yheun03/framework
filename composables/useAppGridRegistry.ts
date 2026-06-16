/**
 * AppGrid renderer/editor 등록 정보를 관리하는 composable 파일입니다.
 */
import type {GridApi} from 'ag-grid-community';

const registry = new Map<string, GridApi>();

export function useAppGridRegistry() {
    function register(id: string, api: GridApi) {
        registry.set(id, api);
    }

    function unregister(id: string) {
        registry.delete(id);
    }

    function getApi(id: string) {
        return registry.get(id);
    }

    return {
        register,
        unregister,
        getApi,
    };
}
