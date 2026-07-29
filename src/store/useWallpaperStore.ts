import { create } from 'zustand';

export interface Wallpaper {
  id: string;
  uri: string;
}

const MOCK_WALLPAPERS: Wallpaper[] = [
  { id: '1', uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1000' },
  { id: '2', uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000' },
  { id: '3', uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000' },
  { id: '4', uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000' },
  { id: '5', uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1000' },
  { id: '6', uri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=1000' },
  { id: '7', uri: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=1000' },
  { id: '8', uri: 'https://picsum.photos/seed/wall8/800/1200' },
  { id: '9', uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000' },
  { id: '10', uri: 'https://picsum.photos/seed/wall10/800/1200' },
  { id: '11', uri: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1000' },
  { id: '12', uri: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1000' },
  { id: '13', uri: 'https://picsum.photos/seed/wall13/800/1200' },
  { id: '14', uri: 'https://picsum.photos/seed/wall14/800/1200' },
  { id: '15', uri: 'https://picsum.photos/seed/wall15/800/1200' },
  { id: '16', uri: 'https://picsum.photos/seed/wall16/800/1200' },
  { id: '17', uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000' },
  { id: '18', uri: 'https://picsum.photos/seed/wall18/800/1200' },
  { id: '19', uri: 'https://picsum.photos/seed/wall19/800/1200' },
  { id: '20', uri: 'https://picsum.photos/seed/wall20/800/1200' },
];

interface WallpaperState {
  wallpapers: Wallpaper[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const useWallpaperStore = create<WallpaperState>((set) => ({
  wallpapers: MOCK_WALLPAPERS,
  favorites: [],
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((favId) => favId !== id)
        : [...state.favorites, id],
    })),
}));
