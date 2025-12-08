'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface FavoritesContextType {
    favorites: string[]; // Array of course IDs
    addToFavorites: (courseId: string) => void;
    removeFromFavorites: (courseId: string) => void;
    isFavorite: (courseId: string) => boolean;
    toggleFavorite: (courseId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        try {
            const stored = localStorage.getItem('course_favorites');
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load favorites', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);


    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('course_favorites', JSON.stringify(favorites));
        }
    }, [favorites, isLoaded]);

    const addToFavorites = useCallback((courseId: string) => {
        setFavorites(prev => {
            if (prev.includes(courseId)) return prev;
            return [...prev, courseId];
        });
    }, []);

    const removeFromFavorites = useCallback((courseId: string) => {
        setFavorites(prev => prev.filter(id => id !== courseId));
    }, []);

    const toggleFavorite = useCallback((courseId: string) => {
        setFavorites(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            }
            return [...prev, courseId];
        });
    }, []);

    const isFavorite = useCallback((courseId: string): boolean => {
        return favorites.includes(courseId);
    }, [favorites]);

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                toggleFavorite
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
}
