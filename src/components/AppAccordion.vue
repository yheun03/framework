<template>
    <div class="app-accordion" :class="`app-accordion--${variant}`">
        <div
            v-for="item in items"
            :key="item.id"
            class="app-accordion__item"
            :class="{
                'is-open': isOpen(item.id),
                'is-disabled': item.disabled,
            }"
        >
            <!-- WAI-ARIA Accordion: 제목 버튼을 heading 으로 감싸 제목 목록으로 탐색할 수 있게 합니다. -->
            <component :is="tag" class="app-accordion__heading">
                <button
                    :id="`${uid}-${item.id}-trigger`"
                    type="button"
                    class="app-accordion__trigger"
                    :disabled="item.disabled"
                    :aria-expanded="isOpen(item.id)"
                    :aria-controls="`${uid}-${item.id}-panel`"
                    @click="toggle(item.id)"
                >
                    <div class="app-accordion__trigger-content">
                        <span v-if="prefix" class="app-accordion__prefix">{{ prefix }}</span>
                        <div class="app-accordion__text">
                            <div class="app-accordion__title">
                                <slot v-if="item.titleSlot" :name="item.titleSlot" :item="item" />
                                <strong v-else>{{ item.title }}</strong>
                            </div>
                            <p v-if="item.description" class="app-accordion__desc">{{ item.description }}</p>
                            <div v-else-if="item.descriptionSlot" class="app-accordion__desc">
                                <slot :name="item.descriptionSlot" :item="item" />
                            </div>
                        </div>
                        <span class="app-accordion__icon" :class="{ 'is-open': isOpen(item.id) }" aria-hidden="true">
                            <IconChevronDown />
                        </span>
                    </div>
                </button>
            </component>

            <div v-if="isOpen(item.id)" :id="`${uid}-${item.id}-panel`" class="app-accordion__panel" :aria-labelledby="`${uid}-${item.id}-trigger`">
                <div class="app-accordion__panel-inner">
                    <slot v-if="item.slot" :name="item.slot" :item="item" />
                    <p v-else-if="item.content" class="app-accordion__content">{{ item.content }}</p>
                    <div v-else class="app-accordion__empty">내용이 없습니다.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { IconChevronDown } from '@/components/icons';
import { computed, ref, useId } from 'vue';

const props = defineProps({
    items: { type: Array, required: true },
    /** v-model: 열린 아이템 id 배열 */
    modelValue: { type: Array, default: undefined },
    /** true: 여러 개 동시 열림 / false: 하나만 열림 */
    multiple: { type: Boolean, default: true },
    /** 최초 열림 규칙 (v-model 미사용 시) */
    initial: { type: String, default: 'none' },
    /** card(기본) / line(드롭다운 테이블형, Figma 13. Table - 드롭 다운 테이블) */
    variant: { type: String, default: 'card' },
    /** 제목 앞 머리글 (예: 'Q.') */
    prefix: { type: String, default: '' },
    /** 제목 버튼을 감싸는 태그 (페이지 제목 순서에 맞게 h2 / h3 / h4 지정) */
    tag: { type: String, default: 'div' },
});

const uid = `app-accordion-${useId()}`;

const emit = defineEmits(['update:modelValue', 'toggle']);

const enabledIds = props.items.filter((item) => !item.disabled).map((item) => item.id);
const initialIds = props.initial === 'all' ? enabledIds : props.initial === 'first' && enabledIds.length ? [enabledIds[0]] : [];
const openedIds = ref(initialIds);
const currentIds = computed(() => props.modelValue ?? openedIds.value);

function isOpen(id) {
    return currentIds.value.includes(id);
}

function toggle(id) {
    const next = isOpen(id) ? currentIds.value.filter((itemId) => itemId !== id) : props.multiple ? [...currentIds.value, id] : [id];

    if (props.modelValue === undefined) openedIds.value = next;
    emit('update:modelValue', next);
    emit('toggle', { id, open: next.includes(id) });
}
</script>
