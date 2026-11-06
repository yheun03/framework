// 배포시 api-url 동적할당 파일 지우지 마세요
// docker-compose 의 MODE 값으로 컨테이너 시작 시 덮어씁니다. (dev / prd)
window.VITE_APP_MODE = 'dev';
