<template>
    <div class="app-grid-cell-control" @click.stop>
        <AppChoice :model-value="checked" type="checkbox" size="sm" @update:model-value="handleChange" />
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppChoice from '@/components/AppChoice.vue';

const props = defineProps({
    params: { type: Object, required: true },
});

const checked = ref(false);

function syncChecked() {
    checked.value = Boolean(props.params.node?.isSelected?.());
}

function handleChange(value) {
    props.params.node?.setSelected?.(Boolean(value));
    syncChecked();
}

onMounted(() => {
    syncChecked();
    props.params.node?.addEventListener?.('rowSelected', syncChecked);
});

onBeforeUnmount(() => {
    props.params.node?.removeEventListener?.('rowSelected', syncChecked);
});
</script>
