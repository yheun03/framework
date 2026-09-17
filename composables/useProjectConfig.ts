import type { ProjectConfig } from '~/types/project';

export function useProjectConfig(): Readonly<ProjectConfig> {
    const config = useRuntimeConfig();

    return config.public.project as Readonly<ProjectConfig>;
}
