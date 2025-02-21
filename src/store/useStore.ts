import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Video } from '../types';

interface Store {
  favorites: Video[];
  darkMode: boolean;
  addToFavorites: (video: Video) => void;
  removeFromFavorites: (videoId: string) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      favorites: [],
      darkMode: true,
      addToFavorites: (video) =>
        set((state) => ({
          favorites: [...state.favorites, video],
        })),
      removeFromFavorites: (videoId) =>
        set((state) => ({
          favorites: state.favorites.filter((v) => v.id !== videoId),
        })),
      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),
    }),
    {
      name: 'youtube-viewer-storage',
    }
  )
);