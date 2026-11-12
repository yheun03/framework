var e=`<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">선택 팝업</h1>
                <p class="business-page__desc">
                    품목 · 거래처 · 설비처럼 코드를 골라 넣는 찾기 팝업입니다. 팝업에서 고른 값을 await 로 바로 받습니다.
                </p>
            </div>
        </header>

        <AppSection title="수주 품목 입력">
            <div class="business-form-grid">
                <AppInputGroup label="품목">
                    <AppInput v-model="form.itemName" placeholder="품목을 찾아 선택하세요" readonly />
                    <AppButton size="lg" @click="findItem">찾기</AppButton>
                </AppInputGroup>
                <AppInput v-model="form.itemCode" label="품목코드" readonly />
                <AppInput v-model="form.spec" label="규격" readonly />
            </div>
        </AppSection>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useModal } from '@/composables/useModal';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import AppInputGroup from '@/components/AppInputGroup.vue';
import AppSection from '@/components/Section/AppSection.vue';
import PageDemoItemPicker from '@/components/PageDemo/picker/PageDemoItemPicker.vue';

const modal = useModal();
const form = reactive({ itemCode: '', itemName: '', spec: '' });

async function findItem() {
    const item = await modal.pick(PageDemoItemPicker, { title: '품목 찾기', size: 'lg', componentProps: { keyword: form.itemName } });
    if (!item) return; // 닫기 · 취소
    Object.assign(form, { itemCode: item.code, itemName: item.name, spec: item.spec });
}
<\/script>
`;export{e as default};