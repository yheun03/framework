import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { usePreferencesStore } from './store/preferences';

import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'flatpickr/dist/flatpickr.css';
import 'nouislider/dist/nouislider.css';
import './assets/styles/main.scss';
import '@project-theme-entry';

ModuleRegistry.registerModules([AllCommunityModule]);

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);

// 저장된 언어 · 테마 적용 (화면 그리기 전)
usePreferencesStore().hydrate();

router.isReady().then(() => app.mount('#app'));
