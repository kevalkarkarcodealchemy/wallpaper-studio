import { create } from 'zustand';

export interface Wallpaper {
  id: string;
  uri: string;
}

interface WallpaperState {
  wallpapers: Wallpaper[];
  favorites: Wallpaper[];
  toggleFavorite: (wallpaper: Wallpaper) => void;
  setWallpapers: (wallpapers: Wallpaper[]) => void;
}

export const useWallpaperStore = create<WallpaperState>((set) => ({
  wallpapers: [],
  setWallpapers: (wallpapers) => set({ wallpapers }),
  favorites: [],
  toggleFavorite: (wallpaper) =>
    set((state) => {
      const isFavorited = state.favorites.some((fav) => fav.id === wallpaper.id);
      return {
        favorites: isFavorited
          ? state.favorites.filter((fav) => fav.id !== wallpaper.id)
          : [...state.favorites, wallpaper],
      };
    }),
}));
