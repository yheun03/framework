/**
 * 모달 뷰어 열기/닫기와 표시 상태를 관리하는 composable 파일입니다.
 */
import AppModalViewerPdf from '~/components/Modal/AppModalViewerPdf.vue';
import AppModalViewerImage from '~/components/Modal/AppModalViewerImage.vue';
import {useModalStore} from '~/stores/modal';

type ImageViewerSource = {
    name?: string;
    url?: string;
    alt?: string;
    images?: {
        url: string;
        alt?: string;
    }[];
};

type PdfViewerSource = {
    name?: string;
    path?: string;
    file?: File;
};

export function useModalViewer() {
    const modalStore = useModalStore();

    function openImageViewer(source: ImageViewerSource) {
        const items = source.images?.length ? source.images : undefined;
        const firstItem = items?.[0];
        const src = source.url || firstItem?.url;

        if (!src) return;

        modalStore.modalOpen({
            type: 'custom',
            title: source.name || '이미지 미리보기',
            width: '960px',
            component: AppModalViewerImage,
            componentProps: {
                src,
                alt: source.alt || firstItem?.alt || source.name || '이미지 미리보기',
                items,
            },
        });
    }

    function openPdfViewer(source: PdfViewerSource) {
        if (!source.path && !source.file) return;

        modalStore.modalOpen({
            type: 'custom',
            title: source.name || 'PDF 미리보기',
            width: '1100px',
            height: '80vh',
            component: AppModalViewerPdf,
            componentProps: {
                src: source.path,
                file: source.file,
                fileName: source.name,
            },
        });
    }

    return {
        openImageViewer,
        openPdfViewer,
    };
}
