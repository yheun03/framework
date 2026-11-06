import { projectConfig } from '@/project.config';

/**
 * 프로젝트 공통 설정(회사명 · 서비스명 등)을 읽습니다.
 */
export function useProjectConfig() {
    return projectConfig;
}
