export type WallpaperTarget = 'home' | 'lock' | 'both';

export interface SetWallpaperResult {
  success: boolean;
  message: string;
  uri?: string;
}
