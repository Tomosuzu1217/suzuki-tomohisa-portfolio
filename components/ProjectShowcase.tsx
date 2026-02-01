import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWebApps } from '../hooks/useFirestoreData';
import { WebApp } from '../types';

// Default projects (fallback if no Firestore data)
export const defaultProjects = [
    {
        id: 'rag-chat',
        title: 'AIナレッジチャット',
        subtitle: 'RAG Search System',
        url: 'https://rag-search-c85d8.web.app',
        description: 'PDF、Excel、Word、画像などのファイルをアップロードするだけで、その内容に基づいた回答を提供するRAGシステムです。TF-IDFとキーワードマッチングを組み合わせたハイブリッド検索により、日本語に最適化された高精度な情報検索を実現。回答には引用元ファイル名と信頼度スコアを明示し、ハルシネーションを抑制します。',
        shortDescription: 'ファイルをアップロードするだけでAIが内容を理解し、質問に回答するRAGシステム。',
        images: [
            '/プロジェクト_RAGチャット/RAG①.jpg',
            '/プロジェクト_RAGチャット/RAG②.jpg',
            '/プロジェクト_RAGチャット/RAG③.jpg',
            '/プロジェクト_RAGチャット/RAG④.jpg',
        ],
        category: 'AI Assistant',
        tags: ['RAG', 'AI検索', 'Firebase', 'ナレッジ管理'],
    },
    {
        id: 'sharebudget',
        title: 'PairFinance',
        subtitle: 'Smart Household Budget App',
        url: 'https://sharebudget-d2faf.web.app',
        description: 'カップルやルームシェアなどの共同生活における「お金の管理」と「精算」の煩わしさを解消するスマート家計簿アプリです。レシートを撮影するだけでAIが内容を自動入力し、誰がいくら払ったかをリアルタイムに共有。毎月の精算もワンタップで最適な支払い額を算出します。PWA対応でスマホからアプリ感覚で利用可能。',
        shortDescription: 'レシート撮影でAI自動入力、共同生活の精算を効率化するスマート家計簿。',
        images: [
            '/プロジェクト_sharebuget/アプリ①.jpg',
            '/プロジェクト_sharebuget/アプリ②.jpg',
            '/プロジェクト_sharebuget/アプリ③.jpg',
            '/プロジェクト_sharebuget/アプリ④.jpg',
        ],
        category: 'Finance App',
        tags: ['家計簿', 'AI自動入力', 'PWA', '共同精算'],
    },
    {
        id: 'management-dashboard',
        title: '経営コックピット',
        subtitle: 'Business Intelligence Dashboard',
        url: 'https://company-board-2760c.web.app',
        description: '企業の経営データを一元管理・可視化するBIダッシュボードです。解約防止（ChurnGuard）、研修記録（CoachFlow）、サポート管理（CS Mate）、顧客360°ビュー、LINEマーケティングのABテストなど複数の専門モジュールを統合。リアルタイムでKPIを監視し、データドリブンな意思決定を支援します。',
        shortDescription: '経営データを一元管理・可視化するBIダッシュボード。',
        images: [
            '/プロジェクト_経営ダッシュボード/ダッシュボード①.jpg',
            '/プロジェクト_経営ダッシュボード/ダッシュボード②.jpg',
            '/プロジェクト_経営ダッシュボード/ダッシュボード③.jpg',
        ],
        category: 'Business Tool',
        tags: ['BI', 'ダッシュボード', 'KPI管理', 'データ分析'],
    },
    {
        id: 'paper-search',
        title: 'Scholar AI',
        subtitle: 'Research Support System',
        url: 'https://dissertation-research-9946c.web.app',
        description: '最先端のAI技術を活用し、研究トレンドの調査・論文分析・アイデア創出を支援する研究支援アプリです。1回のキーワード入力で、メタ分析、基礎研究、応用研究を幅広く収集し、分野全体の「現状」「強み」「課題」「推奨読書順序」をAIが総合的に分析・提示。研究者の文献調査を効率化します。',
        shortDescription: 'AIで研究トレンド調査・論文分析・アイデア創出を支援。',
        images: [
            '/プロジェクト_論文検索/論文検索①.jpg',
            '/プロジェクト_論文検索/論文検索②.jpg',
            '/プロジェクト_論文検索/論文検索③.jpg',
            '/プロジェクト_論文検索/論文検索④.jpg',
            '/プロジェクト_論文検索/論文検索⑤.jpg',
        ],
        category: 'AI Assistant',
        tags: ['論文検索', 'AI分析', '研究支援', 'アカデミック'],
    },
    {
        id: 'ecostruct',
        title: 'EcoStruct',
        subtitle: 'Biomimicry Business Analysis',
        url: 'https://business-analysis-e6e88.web.app/',
        description: 'ビジネスの構造や課題を「自然界のメカニズム」になぞらえて分析・再構築する、バイオミミクリー（生物模倣）思考のアプリケーションです。AIが企業の有価証券報告書を読み込み、ビジネスモデルを生態系や生物の器官として視覚化。哲学・歴史・音楽など多角的な視点を組み合わせ、非連続なイノベーションの着想を支援します。',
        shortDescription: '自然界のメカニズムでビジネスを分析・再構築するバイオミミクリー思考アプリ。',
        images: [
            '/プロジェクト_ecostruct/プロジェクト①.jpg',
            '/プロジェクト_ecostruct/プロジェクト②.jpg',
            '/プロジェクト_ecostruct/プロジェクト③.jpg',
            '/プロジェクト_ecostruct/プロジェクト④.jpg',
            '/プロジェクト_ecostruct/プロジェクト⑤.jpg',
            '/プロジェクト_ecostruct/プロジェクト⑥.jpg',
        ],
        category: 'AI Assistant',
        tags: ['バイオミミクリー', 'ビジネス分析', 'AI可視化', 'イノベーション'],
    },
    {
        id: 'mental-sync',
        title: 'Mental Sync',
        subtitle: 'AI Self-Understanding Partner',
        url: 'https://mental-sync.web.app/',
        description: '生成AIと心理学的アプローチを融合させた自己理解と問題解決のためのアプリです。ユーザーの「感情」「価値観」「思考」をAIが分析・可視化し、ポリアの問題解決法に基づいた構造的なアプローチで複雑な悩みの解決や目標達成を支援。価値観ランタン機能やマルチモーダル感情AIによる自然な対話が可能です。',
        shortDescription: 'AIが感情・価値観を可視化し、問題解決と自己理解を支援。',
        images: [
            '/プロジェクト_mental-sync/mental-sync①.jpg',
            '/プロジェクト_mental-sync/mental-sync②.jpg',
            '/プロジェクト_mental-sync/mental-sync③.jpg',
            '/プロジェクト_mental-sync/mental-sync④.jpg',
            '/プロジェクト_mental-sync/mental-sync⑤.jpg',
            '/プロジェクト_mental-sync/mental-sync⑥.jpg',
            '/プロジェクト_mental-sync/mental-sync⑦.jpg',
        ],
        category: 'AI Assistant',
        tags: ['心理学', '自己理解', 'ポリア問題解決法', '価値観分析'],
    },
    {
        id: 'roleplay-ai',
        title: 'AI Roleplay',
        subtitle: 'Interactive Training Platform',
        url: 'https://interview-ai-2-bf31.onrender.com',
        description: '最先端のGenerative AI（Gemini 2.5 Flash）と3Dアバター技術を融合させた対話型ロールプレイング・トレーニングアプリです。営業トーク練習、採用面接シミュレーション、接客対応など、様々なシナリオでAIアバターとリアルタイムに対話しコミュニケーションスキルを磨けます。セッション終了後にはAIが会話内容を評価し、具体的な改善点やスコアをフィードバックします。',
        shortDescription: '3DアバターとAI対話でコミュニケーションスキルをトレーニング。',
        images: [
            '/プロジェクト_roleplay/アプリ⓪.jpg',
            '/プロジェクト_roleplay/アプリ①.jpg',
            '/プロジェクト_roleplay/アプリ③.jpg',
        ],
        category: 'AI Training',
        tags: ['ロールプレイ', '3Dアバター', '面接練習', 'AIフィードバック'],
    },
    {
        id: 'seosearch',
        title: 'GEO Analyzer',
        subtitle: 'SEO/GEO Competitive Analysis Tool',
        url: 'https://seo-search-b14f4.web.app/',
        description: '「検索」から「生成」へ。SEOを超えたGEO（Generative Engine Optimization）を実現する実験的アプリケーションです。指定したキーワードに基づいて、Google検索の上位記事（1ページ目）と下位記事（10ページ目）をAIが比較分析。AI（SGE/AI Overviews）に「引用」されるための高品質な記事構成案と、コンテンツの改善ポイントを自動生成します。',
        shortDescription: 'SEO/GEO競合分析と高品質な記事構成案をAIが自動生成。',
        images: [
            '/プロジェクト_seosearch/アプリ②.jpg',
            '/プロジェクト_seosearch/アプリ②2.jpg',
            '/プロジェクト_seosearch/アプリ③.jpg',
        ],
        category: 'AI Assistant',
        tags: ['SEO', 'GEO', 'AI分析', 'コンテンツ戦略'],
    },
];



// Lazy loaded image with intersection observer
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={`relative ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#C5A265] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
        </div>
    );
};

// Image Slider Component with lazy loading
export const ImageSlider: React.FC<{ images: string[]; autoPlay?: boolean }> = ({ images, autoPlay = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoPlay || isPaused || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length, autoPlay, isPaused]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    return (
        <div
            className="relative aspect-video bg-[#0a0a0a] overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                >
                    <LazyImage
                        src={images[currentIndex]}
                        alt={`Screenshot ${currentIndex + 1}`}
                        className="w-full h-full"
                    />
                </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C5A265]"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C5A265]"
                        aria-label="Next"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                    ? 'bg-[#C5A265] w-6'
                                    : 'bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// Shared logic: get top N published projects from Firestore, fallback to defaults
function getPublishedProjects(webApps: WebApp[], count: number): ProjectDisplay[] {
    if (webApps.length > 0) {
        const publishedApps = webApps
            .filter(app => app.published)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, count);

        if (publishedApps.length > 0) {
            return publishedApps.map(webAppToProject);
        }
    }
    return defaultProjects.slice(0, count);
}

// Convert WebApp to display format
interface ProjectDisplay {
    id: string;
    title: string;
    subtitle?: string;
    url: string;
    description: string;
    shortDescription: string;
    images: string[];
    tags: string[];
}

const webAppToProject = (app: WebApp): ProjectDisplay => ({
    id: app.id,
    title: app.title,
    subtitle: app.tags[0] || '',
    url: app.url,
    description: app.description,
    shortDescription: app.description.slice(0, 80) + '...',
    images: app.imageUrl ? [app.imageUrl] : ['/プロジェクト_RAGチャット/RAG①.jpg'],
    tags: app.tags,
});

// Project Card Component
const ProjectCard: React.FC<{ project: ProjectDisplay; index: number }> = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 hover:border-[#C5A265]/50 transition-all duration-300"
        >
            <ImageSlider images={project.images} />
            <div className="p-6">
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2 mb-2"
                >
                    <h3 className="font-serif text-xl text-white group-hover/link:text-[#C5A265] transition-colors">
                        {project.title}
                    </h3>
                    <ExternalLink
                        size={16}
                        className="text-[#C5A265] opacity-0 group-hover/link:opacity-100 transition-opacity"
                    />
                </a>
                {project.subtitle && (
                    <p className="text-xs text-[#C5A265] font-mono tracking-wider mb-4">
                        {project.subtitle}
                    </p>
                )}
                <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-4">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="text-[10px] px-2 py-1 bg-[#C5A265]/10 text-[#C5A265] border border-[#C5A265]/30"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5A265]/20 text-[#C5A265] text-xs font-bold tracking-wider hover:bg-[#C5A265] hover:text-black transition-colors"
                >
                    <ExternalLink size={14} />
                    アプリを試す
                </a>
            </div>
        </motion.div>
    );
};

// Compact Project Card for Intro Section
export const CompactProjectCard: React.FC<{ project: ProjectDisplay }> = ({ project }) => {
    return (
        <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#1a1a1a]/60 border border-white/10 hover:border-[#C5A265]/50 transition-all duration-300"
        >
            <div className="aspect-video overflow-hidden">
                <LazyImage
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-4">
                <h4 className="font-serif text-sm text-white group-hover:text-[#C5A265] transition-colors flex items-center gap-2">
                    {project.title}
                    <ExternalLink size={12} className="text-[#C5A265] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[10px] text-white/50 mt-1 line-clamp-2">{project.shortDescription}</p>
            </div>
        </a>
    );
};

// Featured Projects for Intro Section (shows 3 most recent from Firestore)
export const FeaturedProjects: React.FC = () => {
    const { webApps, loading } = useWebApps();
    const projects = React.useMemo(() => getPublishedProjects(webApps, 3), [webApps]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-video bg-[#1a1a1a] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project) => (
                <CompactProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};

// Main ProjectShowcase Component (shows 3 most recent from Firestore)
export const ProjectShowcase: React.FC = () => {
    const { webApps, loading } = useWebApps();
    const projects = React.useMemo(() => getPublishedProjects(webApps, 3), [webApps]);

    return (
        <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <p className="text-[#C5A265] text-xs font-mono tracking-[0.3em] mb-4">
                        PROOF OF CONCEPT
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                        プロジェクト
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        AIとデータサイエンスを活用したPoC（概念実証）プロダクト。
                        {loading ? '' : `直近更新の${projects.length}プロジェクトを表示中。`}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-video bg-[#1a1a1a] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectShowcase;
