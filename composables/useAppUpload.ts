import {buildUploadHelperText, isAcceptedUploadType} from '~/utils/upload';

type UploadBaseProps = {
    disabled?: boolean;
    multiple?: boolean;
    accept?: string;
    allowDrop?: boolean;
    maxSizeBytes?: number;
    maxCount?: number;
};

export type AppUploadModelValue<Item> = string | Item | (string | Item)[] | null;

export function normalizeUploadItems<Item>(
    modelValue: AppUploadModelValue<Item> | undefined,
    createStringItem: (value: string, index: number) => Item,
) {
    if (!modelValue) return [];

    const sourceItems = Array.isArray(modelValue) ? modelValue : [modelValue];

    return sourceItems.map((value, index) => (typeof value === 'string' ? createStringItem(value, index) : value));
}

export function resolveUploadValue<Item>(items: Item[], multiple?: boolean) {
    return multiple ? items : (items[0] ?? null);
}

export function useAppUpload(props: UploadBaseProps, emitError: (message: string, detail?: unknown) => void) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const dragOver = ref(false);

    const rootClasses = computed(() => ({
        'is-disabled': props.disabled,
        'is-dragover': dragOver.value,
        'is-multiple': props.multiple,
    }));

    const helperText = computed(() => buildUploadHelperText(props));

    function handleFileOpen() {
        if (props.disabled) return;
        fileInput.value?.click();
    }

    function shouldAcceptFile(file: File) {
        if (!isAcceptedUploadType(file, props.accept)) {
            emitError('허용되지 않는 파일 형식입니다.', {
                accept: props.accept,
                type: file.type,
                name: file.name,
            });
            return false;
        }

        if (props.maxSizeBytes != null && file.size > props.maxSizeBytes) {
            emitError('파일 용량 제한을 초과했습니다.', {
                maxSizeBytes: props.maxSizeBytes,
                size: file.size,
                name: file.name,
            });
            return false;
        }

        return true;
    }

    function handleDragEnter() {
        if (!props.allowDrop || props.disabled) return;
        dragOver.value = true;
    }

    function handleDragOver() {
        if (!props.allowDrop || props.disabled) return;
        dragOver.value = true;
    }

    function handleDragLeave() {
        dragOver.value = false;
    }

    async function handleDrop(event: DragEvent, onFiles: (files: File[]) => Promise<void>) {
        dragOver.value = false;

        if (!props.allowDrop || props.disabled) return;

        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.length) return;

        await onFiles(files);
    }

    return {
        fileInput,
        rootClasses,
        helperText,
        handleFileOpen,
        shouldAcceptFile,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
}
