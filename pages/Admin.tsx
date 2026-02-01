import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Plus, ExternalLink, Trash2, Edit3, Eye, EyeOff,
    ArrowLeft, AppWindow, Video, Settings, X, Save, RefreshCw, LogOut, Shield, Database, AlertCircle
} from 'lucide-react';
import { WaterBackground } from '../components/WaterBackground';
import { GlassCard, LoadingSpinner, ErrorBanner } from '../components/SharedUI';
import { WebApp, Sora2Video } from '../types';
import { useWebApps, useSora2Videos } from '../hooks/useFirestoreData';
import { useAuth } from '../hooks/useAuth';

// Default projects to seed Firestore
const DEFAULT_PROJECTS = [
    {
        title: 'AIナレッジチャット',
        description: 'PDF、Excel、Word、画像などのファイルをアップロードするだけで、その内容に基づいた回答を提供するRAGシステムです。TF-IDFとキーワードマッチングを組み合わせたハイブリッド検索により、日本語に最適化された高精度な情報検索を実現。回答には引用元ファイル名と信頼度スコアを明示し、ハルシネーションを抑制します。',
        url: 'https://rag-search-c85d8.web.app',
        imageUrl: '/プロジェクト_RAGチャット/RAG①.jpg',
        tags: ['RAG', 'Gemini 2.5', 'Firebase', 'Python'],
        published: true,
        createdAt: new Date('2025-12-01').toISOString()
    },
    {
        title: '経営コックピット',
        description: '企業の経営データを一元管理・可視化するBIダッシュボードです。解約防止（ChurnGuard）、研修記録（CoachFlow）、サポート管理（CS Mate）、顧客360°ビュー、LINEマーケティングのABテスト、請求消込（ReconcileAI）など複数の専門モジュールを統合。',
        url: 'https://company-board-2760c.web.app',
        imageUrl: '/プロジェクト_経営ダッシュボード/ダッシュボード①.jpg',
        tags: ['BI', 'Firebase Auth', 'Gemini API', 'React'],
        published: true,
        createdAt: new Date('2025-11-15').toISOString()
    },
    {
        title: 'Scholar AI',
        description: '最先端のAI技術を活用し、研究トレンドの調査・論文分析・アイデア創出を支援する研究支援アプリです。1回のキーワード入力で、メタ分析、基礎研究、応用研究を幅広く収集し、分野全体の「現状」「強み」「課題」「推奨読書順序」をAIが総合的に分析・提示。',
        url: 'https://dissertation-research-9946c.web.app',
        imageUrl: '/プロジェクト_論文検索/論文検索①.jpg',
        tags: ['AI Research', 'Gemini 2.5', 'TypeScript', 'Vite'],
        published: true,
        createdAt: new Date('2025-10-20').toISOString()
    }
];

// WebApp Card Component (Admin)
const WebAppCard: React.FC<{
    app: WebApp;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePublish: () => void;
}> = ({ app, onEdit, onDelete, onTogglePublish }) => (
    <GlassCard className="group hover:border-[#C5A265]/50 transition-all duration-300">
        <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden">
            {app.imageUrl ? (
                <img
                    src={app.imageUrl}
                    alt={app.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <AppWindow className="text-[#C5A265]/30" size={48} />
                </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onTogglePublish}
                    className={`p-2 ${app.published ? 'bg-green-600' : 'bg-neutral-700'} hover:bg-[#C5A265] transition-colors`}
                    title={app.published ? '公開中' : '非公開'}
                >
                    {app.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={onEdit} className="p-2 bg-neutral-800 hover:bg-[#C5A265] transition-colors">
                    <Edit3 size={14} />
                </button>
                <button onClick={onDelete} className="p-2 bg-red-900 hover:bg-red-700 transition-colors">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-serif text-lg text-white mb-2">{app.title}</h3>
            <p className="text-sm text-white/60 line-clamp-2 mb-3">{app.description}</p>
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

// SORA2 Video Card Component (Admin)
const Sora2VideoCard: React.FC<{
    video: Sora2Video;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePublish: () => void;
}> = ({ video, onEdit, onDelete, onTogglePublish }) => (
    <GlassCard className="group hover:border-[#C5A265]/50 transition-all duration-300">
        <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden">
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
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={onTogglePublish}
                    className={`p-2 ${video.published ? 'bg-green-600' : 'bg-neutral-700'} hover:bg-[#C5A265] transition-colors`}
                >
                    {video.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={onEdit} className="p-2 bg-neutral-800 hover:bg-[#C5A265] transition-colors">
                    <Edit3 size={14} />
                </button>
                <button onClick={onDelete} className="p-2 bg-red-900 hover:bg-red-700 transition-colors">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-serif text-lg text-white mb-2">{video.title}</h3>
            <div className="bg-[#0a0a0a] p-3 border-l-2 border-[#C5A265] mb-3">
                <p className="text-xs text-[#C5A265]/80 mb-1">PROMPT</p>
                <p className="text-sm text-white/70 line-clamp-3 font-mono">{video.prompt}</p>
            </div>
        </div>
    </GlassCard>
);

// Add/Edit Modal for WebApp
const WebAppModal: React.FC<{
    app: WebApp | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (app: Omit<WebApp, 'id'> & { id?: string }) => void;
}> = ({ app, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<WebApp>>({
        title: '',
        description: '',
        url: '',
        imageUrl: '',
        tags: [],
        published: true
    });
    const [tagInput, setTagInput] = useState('');

    React.useEffect(() => {
        if (app) {
            setFormData(app);
        } else {
            setFormData({
                title: '',
                description: '',
                url: '',
                imageUrl: '',
                tags: [],
                published: true
            });
        }
    }, [app, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: app?.id,
            title: formData.title || '',
            description: formData.description || '',
            url: formData.url || '',
            imageUrl: formData.imageUrl,
            tags: formData.tags || [],
            createdAt: app?.createdAt || new Date().toISOString(),
            published: formData.published ?? true
        });
        onClose();
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-lg bg-[#141414] border border-[#C5A265]/30 p-6 max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[#C5A265] font-mono text-sm tracking-widest">
                            {app ? 'EDIT WEB APP' : 'ADD WEB APP'}
                        </h2>
                        <button onClick={onClose} className="text-white/50 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">タイトル</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">説明</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full h-24 bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">URL</label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">画像URL（任意）</label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">タグ</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                                    placeholder="タグを入力してEnter"
                                />
                                <button type="button" onClick={addTag} className="px-4 bg-[#C5A265]/20 text-[#C5A265] hover:bg-[#C5A265] hover:text-black transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {formData.tags?.map((tag, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-[#C5A265]/20 text-[#C5A265] flex items-center gap-1">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
                                            <X size={10} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                                className="w-4 h-4 accent-[#C5A265]"
                            />
                            <label htmlFor="published" className="text-sm text-white/70">公開する</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#C5A265] text-black font-bold text-sm tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> 保存
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Add/Edit Modal for SORA2 Video
const VideoModal: React.FC<{
    video: Sora2Video | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (video: Omit<Sora2Video, 'id'> & { id?: string }) => void;
}> = ({ video, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Sora2Video>>({
        title: '',
        prompt: '',
        videoUrl: '',
        thumbnailUrl: '',
        published: true
    });

    React.useEffect(() => {
        if (video) {
            setFormData(video);
        } else {
            setFormData({
                title: '',
                prompt: '',
                videoUrl: '',
                thumbnailUrl: '',
                published: true
            });
        }
    }, [video, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: video?.id,
            title: formData.title || '',
            prompt: formData.prompt || '',
            videoUrl: formData.videoUrl || '',
            thumbnailUrl: formData.thumbnailUrl,
            createdAt: video?.createdAt || new Date().toISOString(),
            published: formData.published ?? true
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-lg bg-[#141414] border border-[#C5A265]/30 p-6 max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[#C5A265] font-mono text-sm tracking-widest">
                            {video ? 'EDIT SORA2 VIDEO' : 'ADD SORA2 VIDEO'}
                        </h2>
                        <button onClick={onClose} className="text-white/50 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">タイトル</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">プロンプト</label>
                            <textarea
                                value={formData.prompt}
                                onChange={e => setFormData({ ...formData, prompt: e.target.value })}
                                className="w-full h-32 bg-neutral-950 border border-neutral-800 p-3 text-sm text-white font-mono focus:border-[#C5A265] outline-none"
                                placeholder="SORA2で使用したプロンプトを入力..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">動画URL</label>
                            <input
                                type="url"
                                value={formData.videoUrl}
                                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                                placeholder="YouTube, Vimeo, または直接URLを入力"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase text-neutral-500 mb-2">サムネイルURL（任意）</label>
                            <input
                                type="url"
                                value={formData.thumbnailUrl}
                                onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm text-white focus:border-[#C5A265] outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="video-published"
                                checked={formData.published}
                                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                                className="w-4 h-4 accent-[#C5A265]"
                            />
                            <label htmlFor="video-published" className="text-sm text-white/70">公開する</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#C5A265] text-black font-bold text-sm tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> 保存
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Main Admin Component
const Admin: React.FC = () => {
    const { user, loading: authLoading, error: authError, signInWithGoogle, signOut, isAuthenticated } = useAuth();

    const {
        webApps,
        loading: appsLoading,
        error: appsError,
        addWebApp,
        updateWebApp,
        deleteWebApp,
        togglePublish: toggleAppPublish
    } = useWebApps();

    const {
        videos,
        loading: videosLoading,
        error: videosError,
        addVideo,
        updateVideo,
        deleteVideo,
        togglePublish: toggleVideoPublish
    } = useSora2Videos();

    const [activeTab, setActiveTab] = useState<'apps' | 'videos'>('apps');
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<WebApp | null>(null);
    const [editingVideo, setEditingVideo] = useState<Sora2Video | null>(null);
    const [seeding, setSeeding] = useState(false);

    // Seed default projects to Firestore
    const handleSeedProjects = async () => {
        if (webApps.length > 0) {
            if (!confirm('既存のプロジェクトがあります。デフォルトプロジェクトを追加しますか？')) {
                return;
            }
        }
        setSeeding(true);
        try {
            for (const project of DEFAULT_PROJECTS) {
                await addWebApp(project);
            }
            alert('デフォルトプロジェクトを追加しました！');
        } catch (error) {
            console.error('Failed to seed projects:', error);
            alert('プロジェクトの追加に失敗しました。');
        } finally {
            setSeeding(false);
        }
    };

    // WebApp handlers
    const handleSaveApp = async (app: Omit<WebApp, 'id'> & { id?: string }) => {
        if (app.id) {
            await updateWebApp(app as WebApp);
        } else {
            const { id, ...appData } = app;
            await addWebApp(appData);
        }
        setEditingApp(null);
    };

    const handleDeleteApp = async (id: string) => {
        if (confirm('このアプリを削除しますか？')) {
            await deleteWebApp(id);
        }
    };

    // Video handlers
    const handleSaveVideo = async (video: Omit<Sora2Video, 'id'> & { id?: string }) => {
        if (video.id) {
            await updateVideo(video as Sora2Video);
        } else {
            const { id, ...videoData } = video;
            await addVideo(videoData);
        }
        setEditingVideo(null);
    };

    const handleDeleteVideo = async (id: string) => {
        if (confirm('この動画を削除しますか？')) {
            await deleteVideo(id);
        }
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
                <WaterBackground />
                <div className="text-center z-10">
                    <RefreshCw className="animate-spin text-[#C5A265] mx-auto mb-4" size={48} />
                    <p className="text-white/60">認証状態を確認中...</p>
                </div>
            </div>
        );
    }

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
                <WaterBackground />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 w-full max-w-md p-8"
                >
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 p-8">
                        <div className="text-center mb-8">
                            <Shield className="text-[#C5A265] mx-auto mb-4" size={48} />
                            <h1 className="text-xl font-serif text-white mb-2">管理者ログイン</h1>
                            <p className="text-white/50 text-xs">コンテンツの編集には認証が必要です</p>
                        </div>

                        {authError && (
                            <div className="mb-6 p-3 bg-red-900/20 border border-red-900 text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {authError}
                            </div>
                        )}

                        <button
                            onClick={signInWithGoogle}
                            className="w-full py-4 bg-white text-black font-bold text-sm tracking-wider hover:bg-[#C5A265] transition-colors flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Googleでログイン
                        </button>

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-[#C5A265] text-xs hover:text-white transition-colors">
                                ← ポートフォリオに戻る
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <WaterBackground />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#141414]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-[#C5A265] transition-colors">
                            <ArrowLeft size={16} />
                            <span className="text-xs tracking-widest">PORTFOLIO</span>
                        </Link>
                        <div className="h-4 w-px bg-white/20" />
                        <h1 className="text-[#C5A265] text-xs font-mono tracking-[0.2em] flex items-center gap-2">
                            <Shield size={14} /> ADMIN PANEL
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-[10px] text-white/40">
                            {webApps.length} Apps • {videos.length} Videos
                        </div>
                        <div className="h-4 w-px bg-white/20" />
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-white/60">{user?.email}</span>
                            <button
                                onClick={signOut}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-white/60 hover:text-red-400 hover:bg-red-900/20 border border-white/10 hover:border-red-900/50 transition-all"
                                title="ログアウト"
                            >
                                <LogOut size={12} />
                                ログアウト
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Error Messages */}
                    {appsError && <ErrorBanner message={appsError} />}
                    {videosError && <ErrorBanner message={videosError} />}

                    {/* Tab Navigation */}
                    <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                        <button
                            onClick={() => setActiveTab('apps')}
                            className={`flex items-center gap-2 px-6 py-3 text-sm tracking-wider transition-all ${activeTab === 'apps'
                                ? 'bg-[#C5A265] text-black font-bold'
                                : 'border border-white/20 text-white/60 hover:border-[#C5A265] hover:text-[#C5A265]'
                                }`}
                        >
                            <AppWindow size={16} /> WEB APPS
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`flex items-center gap-2 px-6 py-3 text-sm tracking-wider transition-all ${activeTab === 'videos'
                                ? 'bg-[#C5A265] text-black font-bold'
                                : 'border border-white/20 text-white/60 hover:border-[#C5A265] hover:text-[#C5A265]'
                                }`}
                        >
                            <Video size={16} /> SORA2 VIDEOS
                        </button>
                    </div>

                    {/* Web Apps Section */}
                    {activeTab === 'apps' && (
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-2xl text-white">Webアプリ管理</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSeedProjects}
                                        disabled={seeding}
                                        className="flex items-center gap-2 px-4 py-2 border border-[#C5A265] text-[#C5A265] text-xs font-bold tracking-wider hover:bg-[#C5A265] hover:text-black transition-colors disabled:opacity-50"
                                        title="デフォルトプロジェクトを追加"
                                    >
                                        {seeding ? <RefreshCw size={16} className="animate-spin" /> : <Database size={16} />}
                                        {seeding ? '追加中...' : 'シードデータ'}
                                    </button>
                                    <button
                                        onClick={() => { setEditingApp(null); setIsAppModalOpen(true); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#C5A265] text-black text-xs font-bold tracking-wider hover:bg-white transition-colors"
                                    >
                                        <Plus size={16} /> 追加
                                    </button>
                                </div>
                            </div>

                            {appsLoading ? (
                                <LoadingSpinner />
                            ) : webApps.length === 0 ? (
                                <GlassCard className="p-12 text-center">
                                    <AppWindow className="mx-auto text-[#C5A265]/30 mb-4" size={48} />
                                    <p className="text-white/50 mb-4">まだWebアプリが登録されていません</p>
                                    <button
                                        onClick={() => { setEditingApp(null); setIsAppModalOpen(true); }}
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#C5A265] text-[#C5A265] text-xs hover:bg-[#C5A265] hover:text-black transition-colors"
                                    >
                                        <Plus size={14} /> 最初のアプリを追加
                                    </button>
                                </GlassCard>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {webApps.map(app => (
                                        <WebAppCard
                                            key={app.id}
                                            app={app}
                                            onEdit={() => { setEditingApp(app); setIsAppModalOpen(true); }}
                                            onDelete={() => handleDeleteApp(app.id)}
                                            onTogglePublish={() => toggleAppPublish(app.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Videos Section */}
                    {activeTab === 'videos' && (
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-2xl text-white">SORA2動画管理</h2>
                                <button
                                    onClick={() => { setEditingVideo(null); setIsVideoModalOpen(true); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#C5A265] text-black text-xs font-bold tracking-wider hover:bg-white transition-colors"
                                >
                                    <Plus size={16} /> 追加
                                </button>
                            </div>

                            {videosLoading ? (
                                <LoadingSpinner />
                            ) : videos.length === 0 ? (
                                <GlassCard className="p-12 text-center">
                                    <Video className="mx-auto text-[#C5A265]/30 mb-4" size={48} />
                                    <p className="text-white/50 mb-4">まだSORA2動画が登録されていません</p>
                                    <button
                                        onClick={() => { setEditingVideo(null); setIsVideoModalOpen(true); }}
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#C5A265] text-[#C5A265] text-xs hover:bg-[#C5A265] hover:text-black transition-colors"
                                    >
                                        <Plus size={14} /> 最初の動画を追加
                                    </button>
                                </GlassCard>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {videos.map(video => (
                                        <Sora2VideoCard
                                            key={video.id}
                                            video={video}
                                            onEdit={() => { setEditingVideo(video); setIsVideoModalOpen(true); }}
                                            onDelete={() => handleDeleteVideo(video.id)}
                                            onTogglePublish={() => toggleVideoPublish(video.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>

            {/* Modals */}
            <WebAppModal
                app={editingApp}
                isOpen={isAppModalOpen}
                onClose={() => { setIsAppModalOpen(false); setEditingApp(null); }}
                onSave={handleSaveApp}
            />

            <VideoModal
                video={editingVideo}
                isOpen={isVideoModalOpen}
                onClose={() => { setIsVideoModalOpen(false); setEditingVideo(null); }}
                onSave={handleSaveVideo}
            />
        </div>
    );
};

export default Admin;
