import { storeToRefs } from 'pinia';
import { NAVIGATION_HEADER_ACTIONS } from '~/types/navigation';
import { useNavigationStore } from '~/stores/navigation';

export function useNavigation() {
    const store = useNavigationStore();
    const { menuTree, isLoading } = storeToRefs(store);

    callOnce('navigation:menus', () => store.fetchMenus());

    function getIconSvg(_icon?: string) {
        return null;
    }

    return {
        headerActions: NAVIGATION_HEADER_ACTIONS,
        menuTree,
        isLoading,
        getIconSvg,
    };
}
