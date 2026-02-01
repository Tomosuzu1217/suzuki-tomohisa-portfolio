import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ExternalLink, Play, Eye,
    ArrowLeft, AppWindow, Video, Settings
} from 'lucide-react';
import { WaterBackground } from '../components/WaterBackground';
import { GlassCard, LoadingSpinner, ErrorBanner } from '../components/SharedUI';
import { WebApp, Sora2Video } from '../types';
import { useWebApps, useSora2Videos } from '../hooks/useFirestoreData';
import { useCursorTracker } from '../hooks/useCursorTracker';
import { defaultProjects, ImageSlider } from '../components/ProjectShowcase';

// Extended WebApp type with multiple images and category
interface WebAppWithImages extends WebApp {
    images?: string[];
    category?: string;
}

// WebApp Card Component (Read-only) with Image Slider
const WebAppCard: React.FC<{ app: WebAppWithImages }> = ({ app }) => {
    // Get images array - if images exist use them, otherwise use imageUrl
    const images = app.images && app.images.length > 0
        ? app.images
        : (app.imageUrl ? [app.imageUrl] : []);

    return (
        <GlassCard className="group hover:border-[#C5A265]/50 transition-all duration-300">
            {images.length > 0 ? (
                <ImageSlider images={images} autoPlay={true} />
            ) : (
                <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                        <AppWindow className="text-[#C5A265]/30" size={48} />
                    </div>
                </div>
            )}
            {app.published && (
                <div className="absolute top-2 right-2 p-2 bg-green-600/80 text-white text-[10px] flex items-center gap-1 z-10">
                    <Eye size={12} /> 公開中
                </div>
            )}
            <div className="p-4">
                {app.category && (
                    <span className="inline-block text-[10px] px-2 py-1 bg-[#C5A265]/30 text-[#C5A265] mb-2 rounded">
                        {app.category}
                    </span>
                )}
                <h3 className="font-serif text-base text-white mb-2">{app.title}</h3>
                <p className="text-xs text-white/60 line-clamp-6 mb-3">{app.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                    {app.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-[#C5A265]/20 text-[#C5A265] border border-[#C5A265]/30">
                            {tag}
                        </span>
                    ))}
                </div>
                <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-[#C5A265] hover:text-white transition-colors"
                >
                    <ExternalLink size={12} /> アプリを開く
                </a>
            </div>
        </GlassCard>
    );
};


// SORA2 Video Card Component (Read-only)
const Sora2VideoCard: React.FC<{
    video: Sora2Video;
    onPlay: () => void;
}> = ({ video, onPlay }) => (
    <GlassCard className="group hover:border-[#C5A265]/50 transition-all duration-300">
        <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden cursor-pointer" onClick={onPlay}>
            {video.thumbnailUrl ? (
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                    <Video className="text-[#C5A265]/30" size={48} />
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[#C5A265] flex items-center justify-center">
                    <Play className="text-black ml-1" size={20} />
                </div>
            </div>
            {video.published && (
                <div className="absolute top-2 right-2 p-2 bg-green-600/80 text-white text-[10px] flex items-center gap-1">
                    <Eye size={12} /> 公開中
                </div>
            )}
        </div>
        <div className="p-4">
            <h3 className="font-serif text-base text-white mb-2">{video.title}</h3>
            <div className="bg-[#0a0a0a] p-3 border-l-2 border-[#C5A265]">
                <p className="text-[10px] text-[#C5A265]/80 mb-1">PROMPT</p>
                <p className="text-xs text-white/70 line-clamp-3 font-mono">{video.prompt}</p>
            </div>
        </div>
    </GlassCard>
);

// Video Player Modal
const VideoPlayerModal: React.FC<{
    video: Sora2Video | null;
    isOpen: boolean;
    onClose: () => void;
}> = ({ video, isOpen, onClose }) => {
    if (!isOpen || !video) return null;

    const getEmbedUrl = (url: string) => {
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
        return url;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-4xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-serif text-lg">{video.title}</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white text-sm">
                        ✕ 閉じる
                    </button>
                </div>
                <div className="aspect-video bg-black">
                    {video.videoUrl.includes('youtube') || video.videoUrl.includes('vimeo') ? (
                        <iframe
                            src={getEmbedUrl(video.videoUrl)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video src={video.videoUrl} controls className="w-full h-full" />
                    )}
                </div>
                <div className="mt-4 bg-[#1a1a1a] p-4 border-l-2 border-[#C5A265]">
                    <p className="text-xs text-[#C5A265] mb-2">PROMPT</p>
                    <p className="text-sm text-white/80 font-mono whitespace-pre-wrap">{video.prompt}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Main Dashboard Component (Public Read-only)
const Dashboard: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useCursorTracker(containerRef);

    const {
        webApps,
        loading: appsLoading,
        error: appsError,
    } = useWebApps();

    const {
        videos,
        loading: videosLoading,
        error: videosError,
    } = useSora2Videos();

    const [activeTab, setActiveTab] = useState<'apps' | 'videos'>('apps');
    const [playingVideo, setPlayingVideo] = useState<Sora2Video | null>(null);

    // Convert defaultProjects to WebApp format with images for fallback
    const defaultWebApps: WebAppWithImages[] = useMemo(() => defaultProjects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        url: p.url,
        imageUrl: p.images[0] || undefined,
        images: p.images,
        category: p.category,
        tags: p.tags,
        published: true,
        createdAt: new Date().toISOString()
    })), []);

    // Filter to show only published items, fallback to defaults if no Firestore data
    const publishedApps = useMemo(() => {
        const firestorePublished = webApps.filter(app => app.published);
        // If no published apps from Firestore, use defaults
        if (firestorePublished.length === 0 && !appsLoading) {
            return defaultWebApps;
        }
        return firestorePublished;
    }, [webApps, appsLoading, defaultWebApps]);

    const publishedVideos = useMemo(() => videos.filter(video => video.published), [videos]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#141414] text-white cursor-none"
            style={{ cursor: 'none' }}
        >
            {/* Custom Cursor */}
            <div
                className="fixed w-4 h-4 rounded-full bg-[#C5A265]/50 pointer-events-none mix-blend-difference z-[9999] hidden md:block"
                style={{
                    left: 'var(--x, 50%)',
                    top: 'var(--y, 50%)',
                    transform: 'translate(-50%, -50%)'
                }}
            />
            <div
                className="fixed w-8 h-8 rounded-full border border-[#C5A265]/30 pointer-events-none mix-blend-difference z-[9999] hidden md:block"
                style={{
                    left: 'var(--x, 50%)',
                    top: 'var(--y, 50%)',
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.1s ease-out'
                }}
            />
            <WaterBackground />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#141414]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/" className="flex items-center gap-1 sm:gap-2 text-white/60 hover:text-[#C5A265] transition-colors">
                            <ArrowLeft size={14} />
                            <span className="text-[9px] sm:text-[10px] tracking-widest hidden sm:inline">PORTFOLIO</span>
                        </Link>
                        <div className="h-4 w-px bg-white/20 hidden sm:block" />
                        <h1 className="text-[#C5A265] text-[9px] sm:text-[10px] font-mono tracking-[0.1em] sm:tracking-[0.2em] flex items-center gap-1 sm:gap-2">
                            <Settings size={10} className="sm:hidden" />
                            <Settings size={12} className="hidden sm:block" />
                            <span className="hidden xs:inline">WORKS</span> GALLERY
                        </h1>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-white/40">
                        {publishedApps.length} Apps • {publishedVideos.length} Videos
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-14 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4 md:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Error Messages */}
                    {appsError && <ErrorBanner message={appsError} />}
                    {videosError && <ErrorBanner message={videosError} />}

                    {/* Tab Navigation */}
                    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 border-b border-white/10 pb-2 sm:pb-3">
                        <button
                            onClick={() => setActiveTab('apps')}
                            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wider transition-all ${activeTab === 'apps'
                                ? 'bg-[#C5A265] text-black font-bold'
                                : 'border border-white/20 text-white/60 hover:border-[#C5A265] hover:text-[#C5A265]'
                                }`}
                        >
                            <AppWindow size={12} className="sm:hidden" />
                            <AppWindow size={14} className="hidden sm:block" />
                            <span className="hidden sm:inline">WEB</span> APPS
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wider transition-all ${activeTab === 'videos'
                                ? 'bg-[#C5A265] text-black font-bold'
                                : 'border border-white/20 text-white/60 hover:border-[#C5A265] hover:text-[#C5A265]'
                                }`}
                        >
                            <Video size={12} className="sm:hidden" />
                            <Video size={14} className="hidden sm:block" />
                            <span className="hidden sm:inline">SORA2</span> VIDEOS
                        </button>
                    </div>

                    {/* Web Apps Section */}
                    {activeTab === 'apps' && (
                        <section>
                            <div className="mb-6">
                                <h2 className="font-serif text-xl text-white">公開中のWebアプリ</h2>
                                <p className="text-xs text-white/50 mt-1">AIとデータサイエンスを活用したアプリケーション</p>
                            </div>

                            {appsLoading ? (
                                <LoadingSpinner />
                            ) : publishedApps.length === 0 ? (
                                <GlassCard className="p-12 text-center">
                                    <AppWindow className="mx-auto text-[#C5A265]/30 mb-4" size={48} />
                                    <p className="text-white/50">現在公開中のWebアプリはありません</p>
                                </GlassCard>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {publishedApps.map(app => (
                                        <WebAppCard key={app.id} app={app} />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Videos Section */}
                    {activeTab === 'videos' && (
                        <section>
                            <div className="mb-6">
                                <h2 className="font-serif text-xl text-white">SORA2動画コレクション</h2>
                                <p className="text-xs text-white/50 mt-1">AI生成動画のショーケース</p>
                            </div>

                            {videosLoading ? (
                                <LoadingSpinner />
                            ) : publishedVideos.length === 0 ? (
                                <GlassCard className="p-12 text-center">
                                    <Video className="mx-auto text-[#C5A265]/30 mb-4" size={48} />
                                    <p className="text-white/50">現在公開中の動画はありません</p>
                                </GlassCard>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {publishedVideos.map(video => (
                                        <Sora2VideoCard
                                            key={video.id}
                                            video={video}
                                            onPlay={() => setPlayingVideo(video)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>

            {/* Video Player Modal */}
            <AnimatePresence>
                {playingVideo && (
                    <VideoPlayerModal
                        video={playingVideo}
                        isOpen={!!playingVideo}
                        onClose={() => setPlayingVideo(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
