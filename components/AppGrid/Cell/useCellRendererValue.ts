import { computed } from 'vue'

export function useCellRendererValue<T = unknown>(params: any) {
    const rendererParams = computed(() => params?.colDef?.cellRendererParams ?? {})

    const value = computed<T>({
        get: () => params?.value,
        set: (v) => {
            params?.node?.setDataValue(params?.column?.getColId(), v)
        }
    })

    return {
        rendererParams,
        value
    }
}
