export interface LinkItem {
    id: string;
    label: string;
    href: string;
}

export interface PageMetadata {
    title: string;
    description: string;
}

export interface SitePage extends LinkItem, PageMetadata {}

export interface SiteData {
    name: string;
    description: string;
    logo: string;
}
