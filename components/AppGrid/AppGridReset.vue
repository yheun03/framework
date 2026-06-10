<template></template>

<script setup lang="ts">
import { inject } from "vue";
import { useAppGridRegistry } from "~/composables/useAppGridRegistry";

const target = inject<string>("appGridTarget");

const { getApi } = useAppGridRegistry();
</script>
