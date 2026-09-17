export type ProjectSeoConfig = {
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogImage: string;
    ogImageAlt: string;
    twitterCard: 'summary' | 'summary_large_image';
};

export type ProjectConfig = {
    key: string;
    companyName: string;
    serviceName: string;
    locale: string;
    baseURL: string;
    siteUrl: string;
    favicon: string;
    themeColor: string;
    seo: ProjectSeoConfig;
};
