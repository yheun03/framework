/**
 * 기업별 프로젝트를 시작할 때 가장 먼저 수정하는 설정입니다.
 *
 * key는 아래 기업 전용 폴더명과 반드시 같아야 합니다.
 * - src/components/projects/{key}
 * - src/assets/styles/projects/{key}
 * - public/images/projects/{key}
 *
 * - 새 프로젝트는 npm run init-project -- <key> "<회사명>" "<서비스명>" 으로 폴더 복사와 아래 값 변경을 한 번에 합니다.
 * - 기본 문서 제목(메뉴가 없는 화면)은 .env*(VITE_TITLE), 파비콘은 public/images/projects/{key}/favicon.svg 입니다.
 * - 브랜드 대표색은 src/assets/styles/projects/{key}/_theme.scss 의 $primary 한 곳에서만 정합니다.
 */
const serviceName = 'Framework';

export const projectConfig = {
    key: 'framework',
    companyName: 'Jonsoft',
    serviceName,
    // index.html 의 <meta name="description">
    description: 'Jonsoft MES · ERP 업무 관리 시스템 공통 프레임워크 (Vue 3 + Vite)',
    // 상단 탭 오른쪽 '소스 코드 보기' 버튼 (프레임워크 데모용 - 실제 프로젝트는 false)
    showSourceViewer: true,
    // 로그인 (store/auth.js · router/guard.js · services/api/apiClient.js)
    // enabled: false → 로그인 없이 모든 화면 열람 (퍼블리싱 · 데모)
    auth: {
        enabled: false,
        loginPath: '/auth/sign-in',
        loginUrl: '/auth/login', // POST { email, password } → { accessToken, user }
        logoutUrl: '/auth/logout',
    },
    // 문서 제목: 메뉴명 | serviceName (serviceName 만 바꾸면 함께 바뀝니다)
    titleTemplate: `%s | ${serviceName}`,
};
