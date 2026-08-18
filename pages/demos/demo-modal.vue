<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">
                        modal host + composable 기반 모달 데모입니다. 개별 모달 컴포넌트를 직접 렌더링하지 않고, handler에서
                        <code>openAlert(...)</code>처럼 호출해 Alert / Confirm / Custom 모달을 엽니다.
                    </p>
                </header>

                <!-- BASIC -->
                <PageDemoSection class="page-demo-section" title="Basic" description="가장 기본적인 Alert / Confirm / Custom 모달 오픈 예시입니다.">
                    <div class="page-demo-actions">
                        <AppButton variant="fill" @click="handleOpenAlert"> Alert 열기 </AppButton>

                        <AppButton variant="outline" @click="handleOpenConfirm"> Confirm 열기 </AppButton>

                        <AppButton variant="outline" @click="handleOpenCustom"> Custom 열기 </AppButton>
                    </div>
                </PageDemoSection>

                <!-- ALERT -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Alert Props"
                    description="title, message, confirmText, closeOnBackdrop, closeOnEsc, closable 조합 예시입니다."
                >
                    <div class="page-demo-actions">
                        <AppButton variant="fill" @click="handleOpenAlertBasic"> 기본 Alert </AppButton>

                        <AppButton variant="outline" @click="handleOpenAlertNoClose"> 닫기 제한 Alert </AppButton>

                        <AppButton variant="outline" @click="handleOpenAlertCustomText"> 버튼 텍스트 변경 </AppButton>

                        <AppButton variant="outline" @click="handleOpenNestedAlert"> Alert 중첩 열기 </AppButton>
                    </div>
                </PageDemoSection>

                <!-- CONFIRM -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Confirm Props"
                    description="confirmText, cancelText, closeOnBackdrop, closeOnEsc, closable 조합 예시입니다."
                >
                    <div class="page-demo-actions">
                        <AppButton variant="fill" @click="handleOpenConfirmBasic"> 기본 Confirm </AppButton>

                        <AppButton variant="outline" @click="handleOpenConfirmNoDimClose"> 배경 닫기 제한 </AppButton>

                        <AppButton variant="outline" @click="handleOpenConfirmNoEscClose"> ESC 닫기 제한 </AppButton>

                        <AppButton variant="outline" @click="handleOpenConfirmCustomText"> 버튼 텍스트 변경 </AppButton>

                        <AppButton variant="outline" @click="handleOpenNestedConfirm"> Confirm 중첩 열기 </AppButton>
                    </div>
                </PageDemoSection>

                <!-- CUSTOM -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Custom Modal"
                    description="header/body/footer 구조는 유지하고 body, footer 영역에 필요한 컴포넌트를 전달하는 방식입니다. variant로 BEM modifier를 추가할 수 있습니다."
                >
                    <div class="page-demo-actions">
                        <AppButton variant="fill" @click="handleOpenCustom"> Custom 열기 </AppButton>

                        <AppButton variant="outline" @click="handleOpenCustomFooter"> Custom Footer 열기 </AppButton>

                        <AppButton variant="outline" @click="handleOpenNestedCustom"> Custom 중첩 열기 </AppButton>
                    </div>
                </PageDemoSection>

                <!-- VIEWER -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Viewer Modal"
                    description="이미지/PDF 미리보기처럼 `custom` 모달을 재사용하는 예시입니다."
                >
                    <div class="page-demo-actions">
                        <AppButton variant="fill" @click="handleOpenImageViewer"> 이미지 뷰어 열기 </AppButton>

                        <AppButton variant="outline" @click="handleOpenImageGalleryViewer"> 여러 이미지 뷰어 열기 </AppButton>

                        <AppButton variant="outline" @click="handleOpenPdfViewer"> PDF 뷰어 열기 </AppButton>
                    </div>
                </PageDemoSection>

                <!-- CONTROL -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Store Control"
                    description="composable 기준으로 최상단 모달 닫기, 전체 모달 닫기 같은 제어도 가능합니다."
                >
                    <div class="page-demo-actions">
                        <AppButton variant="outline" @click="handleCloseTop"> 최상단 모달 닫기 </AppButton>

                        <AppTextButton @click="handleClearAll"> 전체 모달 닫기 </AppTextButton>
                    </div>
                </PageDemoSection>
            </main>

            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * modal host와 composable 기반으로 Alert / Confirm / Custom 모달을 여는 데모 페이지 컴포넌트입니다.
 */

/* imports */
import { useModal } from '~/composables/useModal';
import { useModalViewer } from '~/composables/useModalViewer';
import PageDemoModalRendererExample from '~/pages/demos/Page_demo/renderer/PageDemoModalRendererExample.vue';

/* stores/composables */
const { title } = useDemoI18n('modal');
const modal = useModal();
const { openImageViewer, openPdfViewer } = useModalViewer();

/* event handlers */
function handleOpenAlert() {
    handleOpenAlertBasic();
}

function handleOpenAlertBasic() {
    modal.openAlert({
        message: '간단한 안내 메시지입니다.',
    });
}

function handleOpenAlertNoClose() {
    modal.openAlert({
        title: '닫기 제한 Alert',
        message: 'dim 클릭과 ESC로는 닫히지 않습니다.',
        closable: false,
        closeOnBackdrop: false,
        closeOnEsc: false,
    });
}

function handleOpenAlertCustomText() {
    modal.openAlert({
        title: '버튼 텍스트 변경',
        message: 'confirmText 속성으로 버튼 문구를 변경할 수 있습니다.',
        confirmText: '이해했습니다',
    });
}

function handleOpenNestedAlert() {
    modal.openAlert({
        title: '1차 Alert',
        message: '확인을 누르면 이 Alert는 유지한 채 상단에 Alert를 하나 더 엽니다.',
        confirmText: '상단 Alert 열기',
        keepOnConfirm: true,
        onConfirm: () => {
            modal.openAlert({
                title: '2차 Alert',
                message: '이 Alert가 최상단입니다.',
            });
        },
    });
}

function handleOpenConfirm() {
    handleOpenConfirmBasic();
}

function handleOpenConfirmBasic() {
    modal.openConfirm({
        message: '정말 진행할까요?',
        onConfirm: () => {
            modal.openAlert({
                title: 'Confirm 결과',
                message: 'Confirm에서 확인을 눌렀습니다.',
            });
        },
    });
}

function handleOpenConfirmNoDimClose() {
    modal.openConfirm({
        title: '배경 닫기 제한',
        message: '배경 클릭으로는 닫히지 않습니다.',
        closeOnBackdrop: false,
    });
}

function handleOpenConfirmNoEscClose() {
    modal.openConfirm({
        title: 'ESC 닫기 제한',
        message: 'ESC 키로는 닫히지 않습니다.',
        closeOnEsc: false,
    });
}

function handleOpenConfirmCustomText() {
    modal.openConfirm({
        title: '버튼 텍스트 변경',
        message: 'confirmText, cancelText 속성으로 버튼 문구를 변경할 수 있습니다.',
        confirmText: '적용하기',
        cancelText: '다음에',
    });
}

function handleOpenNestedConfirm() {
    modal.openConfirm({
        title: '중첩 테스트',
        message: '확인을 누르면 현재 Confirm은 유지한 채 상단에 Alert를 엽니다.',
        confirmText: '상단 Alert 열기',
        keepOnConfirm: true,
        onConfirm: () => {
            modal.openAlert({
                title: '최상단 Alert',
                message: '이 모달이 최상단입니다.',
            });
        },
    });
}

function handleOpenCustom() {
    modal.openCustom(PageDemoModalRendererExample, {
        title: '커스텀 모달',
        width: '640px',
        componentProps: {
            onAction: () => {
                modal.closeTop();
            },
            onNestedAlert: () => {
                modal.openAlert({
                    title: 'Custom 내부 Alert',
                    message: 'Custom 모달 위에 Alert가 열렸습니다.',
                });
            },
        },
    });
}

function handleOpenCustomFooter() {
    modal.openCustom(PageDemoModalRendererExample, {
        title: 'Footer가 있는 Custom',
        width: '640px',
        variant: 'form',
        footer: true,
        confirmText: '적용하기',
        cancelText: '다음에',
        componentProps: {
            onAction: () => modal.closeTop(),
            onNestedAlert: () => {
                modal.openAlert('Custom 모달 위에 Alert가 열렸습니다.');
            },
        },
    });
}

function handleOpenNestedCustom() {
    modal.openCustom(PageDemoModalRendererExample, {
        title: '1차 Custom',
        keepOnConfirm: true,
        componentProps: {
            onAction: () => modal.closeTop(),
            onNestedAlert: () => {
                modal.openCustom(PageDemoModalRendererExample, {
                    title: '2차 Custom',
                    width: '520px',
                    componentProps: {
                        onAction: () => modal.closeTop(),
                    },
                });
            },
        },
    });
}

function handleOpenImageViewer() {
    openImageViewer({
        name: '샘플 이미지',
        url: 'https://picsum.photos/1200/800?random=31',
        alt: 'modal viewer sample image',
    });
}

function handleOpenImageGalleryViewer() {
    openImageViewer({
        name: '샘플 이미지 갤러리',
        images: [
            {
                url: 'https://picsum.photos/1200/800?random=41',
                alt: 'sample gallery image 1',
            },
            {
                url: 'https://picsum.photos/1200/800?random=42',
                alt: 'sample gallery image 2',
            },
            {
                url: 'https://picsum.photos/1200/800?random=43',
                alt: 'sample gallery image 3',
            },
            {
                url: 'https://picsum.photos/1200/800?random=44',
                alt: 'sample gallery image 4',
            },
        ],
    });
}

function handleOpenPdfViewer() {
    openPdfViewer({
        name: '샘플 PDF',
        path: '/files/sample.pdf',
    });
}

function handleCloseTop() {
    modal.closeTop();
}

function handleClearAll() {
    modal.clearAll();
}
</script>
