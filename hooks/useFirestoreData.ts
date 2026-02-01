import { useState, useEffect, useCallback, useRef } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { WebApp, Sora2Video, DashboardData } from '../types';

const LOCAL_STORAGE_KEY = 'suzuki_dashboard_data';

// Default data for empty state
const DEFAULT_DATA: DashboardData = {
    webApps: [],
    sora2Videos: []
};

/**
 * Hook for managing WebApps with Firestore sync
 */
export function useWebApps() {
    const [webApps, setWebApps] = useState<WebApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load from Firestore
    const loadWebApps = useCallback(async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'webApps'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as WebApp[];
            setWebApps(apps);
            setError(null);
        } catch (err) {
            console.error('Failed to load from Firestore, using localStorage:', err);
            // Fallback to localStorage
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                try {
                    const data = JSON.parse(saved) as DashboardData;
                    setWebApps(data.webApps || []);
                } catch (e) {
                    setWebApps([]);
                }
            }
            setError('Firestore接続エラー。ローカルデータを使用中。');
        } finally {
            setLoading(false);
        }
    }, []);

    // Add web app
    const addWebApp = useCallback(async (app: Omit<WebApp, 'id'>) => {
        try {
            const docRef = await addDoc(collection(db, 'webApps'), app);
            const newApp = { id: docRef.id, ...app } as WebApp;
            setWebApps(prev => [newApp, ...prev]);
            return newApp;
        } catch (err) {
            console.error('Failed to add to Firestore:', err);
            // Fallback: add to localStorage
            const newApp = { ...app, id: crypto.randomUUID() } as WebApp;
            setWebApps(prev => {
                const updated = [newApp, ...prev];
                saveToLocalStorage(updated, null);
                return updated;
            });
            return newApp;
        }
    }, []);

    // Update web app
    const updateWebApp = useCallback(async (app: WebApp) => {
        try {
            const docRef = doc(db, 'webApps', app.id);
            const { id, ...data } = app;
            await updateDoc(docRef, data);
            setWebApps(prev => prev.map(a => a.id === app.id ? app : a));
        } catch (err) {
            console.error('Failed to update in Firestore:', err);
            setWebApps(prev => {
                const updated = prev.map(a => a.id === app.id ? app : a);
                saveToLocalStorage(updated, null);
                return updated;
            });
        }
    }, []);

    // Delete web app
    const deleteWebApp = useCallback(async (id: string) => {
        try {
            await deleteDoc(doc(db, 'webApps', id));
            setWebApps(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Failed to delete from Firestore:', err);
            setWebApps(prev => {
                const updated = prev.filter(a => a.id !== id);
                saveToLocalStorage(updated, null);
                return updated;
            });
        }
    }, []);

    // Toggle publish status
    const togglePublish = useCallback(async (id: string) => {
        const app = webAppsRef.current.find(a => a.id === id);
        if (app) {
            await updateWebApp({ ...app, published: !app.published });
        }
    }, [updateWebApp]);

    // Ref to avoid stale closure in togglePublish
    const webAppsRef = useRef(webApps);
    webAppsRef.current = webApps;

    useEffect(() => {
        loadWebApps();
    }, [loadWebApps]);

    return {
        webApps,
        loading,
        error,
        addWebApp,
        updateWebApp,
        deleteWebApp,
        togglePublish,
        refresh: loadWebApps
    };
}

/**
 * Hook for managing Sora2 Videos with Firestore sync
 */
export function useSora2Videos() {
    const [videos, setVideos] = useState<Sora2Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load from Firestore
    const loadVideos = useCallback(async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'sora2Videos'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const vids = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Sora2Video[];
            setVideos(vids);
            setError(null);
        } catch (err) {
            console.error('Failed to load from Firestore, using localStorage:', err);
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                try {
                    const data = JSON.parse(saved) as DashboardData;
                    setVideos(data.sora2Videos || []);
                } catch (e) {
                    setVideos([]);
                }
            }
            setError('Firestore接続エラー。ローカルデータを使用中。');
        } finally {
            setLoading(false);
        }
    }, []);

    // Add video
    const addVideo = useCallback(async (video: Omit<Sora2Video, 'id'>) => {
        try {
            const docRef = await addDoc(collection(db, 'sora2Videos'), video);
            const newVideo = { id: docRef.id, ...video } as Sora2Video;
            setVideos(prev => [newVideo, ...prev]);
            return newVideo;
        } catch (err) {
            console.error('Failed to add to Firestore:', err);
            const newVideo = { ...video, id: crypto.randomUUID() } as Sora2Video;
            setVideos(prev => {
                const updated = [newVideo, ...prev];
                saveToLocalStorage(null, updated);
                return updated;
            });
            return newVideo;
        }
    }, []);

    // Update video
    const updateVideo = useCallback(async (video: Sora2Video) => {
        try {
            const docRef = doc(db, 'sora2Videos', video.id);
            const { id, ...data } = video;
            await updateDoc(docRef, data);
            setVideos(prev => prev.map(v => v.id === video.id ? video : v));
        } catch (err) {
            console.error('Failed to update in Firestore:', err);
            setVideos(prev => {
                const updated = prev.map(v => v.id === video.id ? video : v);
                saveToLocalStorage(null, updated);
                return updated;
            });
        }
    }, []);

    // Delete video
    const deleteVideo = useCallback(async (id: string) => {
        try {
            await deleteDoc(doc(db, 'sora2Videos', id));
            setVideos(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error('Failed to delete from Firestore:', err);
            setVideos(prev => {
                const updated = prev.filter(v => v.id !== id);
                saveToLocalStorage(null, updated);
                return updated;
            });
        }
    }, []);

    // Toggle publish status
    const togglePublish = useCallback(async (id: string) => {
        const video = videosRef.current.find(v => v.id === id);
        if (video) {
            await updateVideo({ ...video, published: !video.published });
        }
    }, [updateVideo]);

    // Ref to avoid stale closure in togglePublish
    const videosRef = useRef(videos);
    videosRef.current = videos;

    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    return {
        videos,
        loading,
        error,
        addVideo,
        updateVideo,
        deleteVideo,
        togglePublish,
        refresh: loadVideos
    };
}

// Helper to save to localStorage (fallback)
function saveToLocalStorage(webApps: WebApp[] | null, videos: Sora2Video[] | null) {
    try {
        const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
        const data = existing ? JSON.parse(existing) : DEFAULT_DATA;
        if (webApps !== null) data.webApps = webApps;
        if (videos !== null) data.sora2Videos = videos;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}
