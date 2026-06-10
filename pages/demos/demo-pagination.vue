<template>
  <div class="page-demo">
    <div class="page-demo-layout">
      <main class="page-demo-main">
        <!-- HEADER -->
        <header class="page-demo__header">
          <h1 class="page-demo__title">{{ title }}</h1>

          <p class="page-demo__desc">{{ description }}</p>
        </header>

        <!-- BASIC -->
        <AppSection
          class="page-demo-accordion"
          title="Basic"
          desc="page, pageSize, total을 사용하는 기본 페이지네이션입니다."
        >
          <AppPagination
            v-model:page="basicPage"
            v-model:page-size="basicPageSize"
            :total="basicTotal"
            @change="handleChange('basic', $event)"
          />
        </AppSection>

        <!-- PAGE SIZE -->
        <AppSection
          class="page-demo-accordion"
          title="Page Size Options"
          desc="pageSizeOptions로 페이지 크기 선택 목록을 변경합니다."
        >
          <AppPagination
            v-model:page="pageSizePage"
            v-model:page-size="pageSize"
            :total="pageSizeTotal"
            :page-size-options="[5, 10, 30, 50]"
            @change="handleChange('pageSize', $event)"
          />
        </AppSection>

        <!-- SIBLING COUNT -->
        <AppSection
          class="page-demo-accordion"
          title="Sibling Count"
          desc="현재 페이지 주변에 노출할 페이지 개수를 조절합니다."
        >
          <div class="page-demo-stack">
            <div class="page-demo-stack">
              <div class="page-demo-hint">siblingCount = 1</div>

              <AppPagination
                v-model:page="siblingOnePage"
                v-model:page-size="siblingPageSize"
                :total="siblingTotal"
                :sibling-count="1"
                :show-page-size="false"
                @change="handleChange('siblingOne', $event)"
              />
            </div>

            <div class="page-demo-stack">
              <div class="page-demo-hint">siblingCount = 2</div>

              <AppPagination
                v-model:page="siblingTwoPage"
                v-model:page-size="siblingPageSize"
                :total="siblingTotal"
                :sibling-count="2"
                :show-page-size="false"
                @change="handleChange('siblingTwo', $event)"
              />
            </div>
          </div>
        </AppSection>

        <!-- SIZE -->
        <AppSection
          class="page-demo-accordion"
          title="Size"
          desc="sm / md 크기를 비교합니다."
        >
          <div class="page-demo-stack">
            <div class="page-demo-stack">
              <div class="page-demo-hint">size = "sm"</div>

              <AppPagination
                v-model:page="smallPage"
                v-model:page-size="smallPageSize"
                :total="smallTotal"
                size="sm"
                :show-page-size="false"
                @change="handleChange('small', $event)"
              />
            </div>

            <div class="page-demo-stack">
              <div class="page-demo-hint">size = "md"</div>

              <AppPagination
                v-model:page="mediumPage"
                v-model:page-size="mediumPageSize"
                :total="mediumTotal"
                size="md"
                :show-page-size="false"
                @change="handleChange('medium', $event)"
              />
            </div>
          </div>
        </AppSection>

        <!-- HIDE OPTIONS -->
        <AppSection
          class="page-demo-accordion"
          title="Hide Total / Page Size"
          desc="showTotal, showPageSize 옵션으로 보조 영역을 숨길 수 있습니다."
        >
          <AppPagination
            v-model:page="simplePage"
            v-model:page-size="simplePageSize"
            :total="simpleTotal"
            :show-total="false"
            :show-page-size="false"
            @change="handleChange('simple', $event)"
          />
        </AppSection>

        <!-- DISABLED -->
        <AppSection
          class="page-demo-accordion"
          title="Disabled"
          desc="disabled 상태에서는 페이지를 변경할 수 없습니다."
        >
          <AppPagination
            v-model:page="disabledPage"
            v-model:page-size="disabledPageSize"
            :total="disabledTotal"
            disabled
          />
        </AppSection>
      </main>

      <aside class="page-demo-aside" aria-label="현재 값 패널">
        <div class="page-demo-aside__sticky">
          <PageDemoPropsSummary />

          <AppSection class="page-demo-accordion" title="Current Value">
            <pre class="page-demo-output">{{ output }}</pre>
          </AppSection>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 페이지네이션 데모 화면의 현재 페이지, 페이지 크기, 변경 이력을 관리하는 페이지 컴포넌트입니다.
 */
const { title, description } = useDemoI18n("pagination");

const basicPage = ref(1);
const basicPageSize = ref(10);
const basicTotal = ref(128);

const pageSizePage = ref(1);
const pageSize = ref(5);
const pageSizeTotal = ref(83);

const siblingOnePage = ref(8);
const siblingTwoPage = ref(8);
const siblingPageSize = ref(10);
const siblingTotal = ref(230);

const smallPage = ref(1);
const smallPageSize = ref(10);
const smallTotal = ref(80);

const mediumPage = ref(1);
const mediumPageSize = ref(10);
const mediumTotal = ref(80);

const simplePage = ref(3);
const simplePageSize = ref(10);
const simpleTotal = ref(95);

const disabledPage = ref(2);
const disabledPageSize = ref(10);
const disabledTotal = ref(42);

const lastChanged = ref<{
  name: string;
  page: number;
  pageSize: number;
} | null>(null);

function handleChange(name: string, payload: { page: number; pageSize: number }) {
  lastChanged.value = {
    name,
    ...payload,
  };
}

const output = computed(() =>
  JSON.stringify(
    {
      basic: {
        page: basicPage.value,
        pageSize: basicPageSize.value,
        total: basicTotal.value,
      },
      pageSize: {
        page: pageSizePage.value,
        pageSize: pageSize.value,
        total: pageSizeTotal.value,
      },
      sibling: {
        siblingOnePage: siblingOnePage.value,
        siblingTwoPage: siblingTwoPage.value,
        pageSize: siblingPageSize.value,
        total: siblingTotal.value,
      },
      size: {
        smallPage: smallPage.value,
        mediumPage: mediumPage.value,
      },
      simple: {
        page: simplePage.value,
        pageSize: simplePageSize.value,
        total: simpleTotal.value,
      },
      disabled: {
        page: disabledPage.value,
        pageSize: disabledPageSize.value,
        total: disabledTotal.value,
      },
      lastChanged: lastChanged.value,
      propsSummary: {
        page: true,
        pageSize: true,
        total: true,
        pageSizeOptions: true,
        siblingCount: true,
        showTotal: true,
        showPageSize: true,
        disabled: true,
        size: ["sm", "md"],
      },
    },
    null,
    2,
  ),
);
</script>
