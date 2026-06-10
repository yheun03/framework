<template>
  <div class="app-pdf-viewer">
    <div v-if="sourceUrl" class="app-pdf-viewer__toolbar">
      <div class="app-pdf-viewer__pager">
        <AppButton
          variant="outline"
          size="sm"
          :disabled="isBusy || pageNumber <= 1"
          @click="handlePreviousPage"
        >
          이전
        </AppButton>

        <span class="app-pdf-viewer__page-status">
          {{ pageNumber }} / {{ pageCount || "-" }}
        </span>

        <AppButton
          variant="outline"
          size="sm"
          :disabled="isBusy || pageNumber >= pageCount"
          @click="handleNextPage"
        >
          다음
        </AppButton>
      </div>

      <div class="app-pdf-viewer__zoom">
        <AppButton
          variant="outline"
          size="sm"
          :disabled="isBusy || scale <= minScale"
          @click="handleZoomOut"
        >
          축소
        </AppButton>

        <span class="app-pdf-viewer__zoom-status">
          {{ Math.round(scale * 100) }}%
        </span>

        <AppButton
          variant="outline"
          size="sm"
          :disabled="isBusy || scale >= maxScale"
          @click="handleZoomIn"
        >
          확대
        </AppButton>
      </div>
    </div>

    <div v-if="sourceUrl" class="app-pdf-viewer__canvas-wrap">
      <canvas
        ref="canvasRef"
        class="app-pdf-viewer__canvas"
        :aria-label="fileName || 'PDF 미리보기'"
      />

      <div v-if="isBusy || errorMessage" class="app-pdf-viewer__status">
        {{ errorMessage || "PDF를 불러오는 중입니다." }}
      </div>
    </div>

    <div v-else class="app-pdf-viewer__empty">미리보기할 PDF가 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

const props = defineProps<{
  src?: string;
  file?: File;
  fileName?: string;
}>();

type PdfJsModule = typeof import("pdfjs-dist");
type PdfDocument = Awaited<ReturnType<PdfJsModule["getDocument"]>["promise"]>;
type RenderTask = ReturnType<
  Awaited<ReturnType<PdfDocument["getPage"]>>["render"]
>;

const minScale = 0.6;
const maxScale = 2.4;
const scaleStep = 0.2;

const canvasRef = ref<HTMLCanvasElement | null>(null);
const objectUrl = ref<string | null>(null);
const pdfDocument = shallowRef<PdfDocument | null>(null);
const pageNumber = ref(1);
const pageCount = ref(0);
const scale = ref(1);
const isLoading = ref(false);
const isRendering = ref(false);
const errorMessage = ref("");

let pdfjsModule: PdfJsModule | null = null;
let renderTask: RenderTask | null = null;
let renderToken = 0;

const sourceUrl = computed(() => {
  if (props.src) return props.src;
  return objectUrl.value;
});

const isBusy = computed(() => isLoading.value || isRendering.value);

watchEffect((onCleanup) => {
  if (!props.file) {
    objectUrl.value = null;
    return;
  }

  const nextUrl = URL.createObjectURL(props.file);
  objectUrl.value = nextUrl;

  onCleanup(() => {
    URL.revokeObjectURL(nextUrl);
    if (objectUrl.value === nextUrl) {
      objectUrl.value = null;
    }
  });
});

watch(
  sourceUrl,
  async (nextUrl) => {
    await loadDocument(nextUrl);
  },
  { immediate: true },
);

watch([pageNumber, scale], () => {
  void renderPage();
});

onBeforeUnmount(() => {
  cleanupRenderTask();
  void cleanupDocument();
});

async function loadPdfJs() {
  if (pdfjsModule) return pdfjsModule;

  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  pdfjsModule = pdfjs;
  return pdfjsModule;
}

async function loadDocument(url: string | null) {
  cleanupRenderTask();
  await cleanupDocument();

  pageNumber.value = 1;
  pageCount.value = 0;
  errorMessage.value = "";

  if (!url) return;

  isLoading.value = true;

  try {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument(url);
    const document = await loadingTask.promise;
    pdfDocument.value = document;
    pageCount.value = document.numPages;
    await renderPage();
  } catch (error) {
    errorMessage.value = "PDF를 불러오지 못했습니다.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

async function renderPage() {
  const document = pdfDocument.value;
  const canvas = canvasRef.value;

  if (!document || !canvas) return;

  const currentToken = ++renderToken;
  cleanupRenderTask();
  isRendering.value = true;
  errorMessage.value = "";

  try {
    const page = await document.getPage(pageNumber.value);
    if (currentToken !== renderToken) return;

    const viewport = page.getViewport({ scale: scale.value });
    const context = canvas.getContext("2d");
    if (!context) return;

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * pixelRatio);
    canvas.height = Math.floor(viewport.height * pixelRatio);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, viewport.width, viewport.height);

    renderTask = page.render({
      canvasContext: context,
      viewport,
    });

    await renderTask.promise;
  } catch (error) {
    if (error instanceof Error && error.name === "RenderingCancelledException")
      return;

    errorMessage.value = "PDF 페이지를 렌더링하지 못했습니다.";
    console.error(error);
  } finally {
    if (currentToken === renderToken) {
      renderTask = null;
      isRendering.value = false;
    }
  }
}

function cleanupRenderTask() {
  if (!renderTask) return;

  renderTask.cancel();
  renderTask = null;
}

async function cleanupDocument() {
  const document = pdfDocument.value;
  pdfDocument.value = null;

  if (!document) return;
  await document.destroy();
}

function handlePreviousPage() {
  pageNumber.value = Math.max(1, pageNumber.value - 1);
}

function handleNextPage() {
  pageNumber.value = Math.min(pageCount.value, pageNumber.value + 1);
}

function handleZoomOut() {
  scale.value = Math.max(
    minScale,
    Number((scale.value - scaleStep).toFixed(1)),
  );
}

function handleZoomIn() {
  scale.value = Math.min(
    maxScale,
    Number((scale.value + scaleStep).toFixed(1)),
  );
}
</script>
