import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { setupApi } from './services/api/setupApi';
import { usePreferencesStore } from './store/preferences';

import './assets/styles/main.scss';
import '@project-theme-entry';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);

// 저장된 언어 · 테마 적용 (화면 그리기 전)
usePreferencesStore().hydrate();
// API 공통 처리(토큰 · 401 · 오류 토스트) 연결
setupApi(router);

router.isReady().then(() => app.mount('#app'));
