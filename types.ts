export interface SiteContent {
  hero: {
    nameJa: string;
    nameEn: string;
    title: string;
    subtitle: string;
    images: string[];
  };
  intro: {
    title: string;
    body: string;
    highlight: string;
  };
  whatIDo: {
    title: string;
    items: string[];
    note: string;
  };
  stance: {
    title: string;
    items: string[];
    conclusion: string;
  };
  skills: {
    title: string;
    items: string[];
  };
  values: {
    title: string;
    items: string[];
  };
  personality: {
    title: string;
    items: string[];
  };
  copy: {
    main: string;
    sub: string[];
  };
  footer: {
    message: string;
  };
}

export type SectionKey = keyof SiteContent;

// Dashboard Types
export interface WebApp {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  published: boolean;
}

export interface Sora2Video {
  id: string;
  title: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  published: boolean;
}

export interface DashboardData {
  webApps: WebApp[];
  sora2Videos: Sora2Video[];
}
