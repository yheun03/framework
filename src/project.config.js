/**
 * 기업별 프로젝트를 시작할 때 가장 먼저 수정하는 설정입니다.
 *
 * key는 아래 기업 전용 폴더명과 반드시 같아야 합니다.
 * - src/components/projects/{key}
 * - src/assets/styles/projects/{key}
 * - public/images/projects/{key}
 *
 * 브라우저 탭 제목 · 파비콘 · 설명은 index.html 과 .env(VITE_TITLE) 에서 수정합니다.
 */
export const projectConfig = {
    key: 'framework',
    companyName: 'Jonsoft',
    serviceName: 'Framework',
    themeColor: '#ff5900',
    // 문서 제목: 메뉴명 | serviceName
    titleTemplate: '%s | Framework',
};
