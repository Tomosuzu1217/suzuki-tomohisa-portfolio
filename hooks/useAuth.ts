import { useState, useEffect } from 'react';
import {
    User,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        // Check for redirect result on mount
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    setAuthState({
                        user: result.user,
                        loading: false,
                        error: null
                    });
                }
            })
            .catch((error) => {
                console.error('Redirect result error:', error);
                setAuthState(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message
                }));
            });

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthState({
                user,
                loading: false,
                error: null
            });
        }, (error) => {
            setAuthState({
                user: null,
                loading: false,
                error: error.message
            });
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            // Try popup first, fallback to redirect if popup is blocked
            try {
                await signInWithPopup(auth, googleProvider);
            } catch (popupError: any) {
                // If popup is blocked, fallback to redirect
                if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
                    console.log('Popup blocked or closed, trying redirect...');
                    await signInWithRedirect(auth, googleProvider);
                } else {
                    throw popupError;
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました';
            setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
            throw error;
        }
    };

    const signOut = async () => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            await firebaseSignOut(auth);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'ログアウトに失敗しました';
            setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
            throw error;
        }
    };

    return {
        user: authState.user,
        loading: authState.loading,
        error: authState.error,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!authState.user
    };
}
