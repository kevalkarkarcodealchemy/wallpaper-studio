/**
 * Cloudinary Configuration
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ALL Cloudinary credentials and tunables live here — in one place only.
 *  Update the values below when you receive your credentials.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * SECURITY NOTES
 * ──────────────
 *  • cloudName  → safe to expose (it appears in every delivery URL)
 *  • apiKey     → safe to expose for READ-ONLY operations (no write access)
 *  • apiSecret  → ⚠️  NEVER put this in your mobile app bundle.
 *                     Store it exclusively in your backend / CI secrets.
 *
 * HOW TO FILL IN YOUR CREDENTIALS
 * ─────────────────────────────────
 *  1. Open the Cloudinary Dashboard → Settings → API Keys
 *  2. Copy your Cloud Name, API Key.
 *  3. Paste them into the CREDENTIALS section below.
 *  4. Commit this file (the API Key is read-only on mobile — that's fine).
 *  5. Never commit your API Secret.
 */

import type { CloudinaryConfig } from '../types/cloudinary';

// ─── 🔑 CREDENTIALS — fill these in ──────────────────────────────────────

/**
 * Your Cloudinary Cloud Name.
 * Found at: https://console.cloudinary.com/settings/api-keys
 *
 * Example: "my-wallpaper-app"
 */
const CLOUD_NAME = 'ur5fixyr'; // ← replace this

/**
 * Your Cloudinary API Key.
 */
const API_KEY = '478132279152427'; // ← replace this

/**
 * Your Cloudinary API Secret.
 * WARNING: Do not commit this to public repositories!
 */
const API_SECRET = 'IYEwLB64j2fiHa0nBWaUAcxRh-0'; // ← paste your API secret here

// ─── 📁 FOLDER STRUCTURE ──────────────────────────────────────────────────

/**
 * The root folder in your Cloudinary Media Library that contains
 * all wallpaper category sub-folders.
 *
 * Your structure:
 *   wallpaper/
 *     Hot/
 *     Music/
 *     Gaming/
 */
const ROOT_FOLDER = 'wallpaper';

// ─── ⚙️  API SETTINGS ─────────────────────────────────────────────────────

/**
 * How many images to load per API request.
 * Cloudinary allows a maximum of 500.
 * Lower values = faster first load; higher = fewer round trips.
 */
const MAX_RESULTS_PER_PAGE = 50;

// ─── Derived / computed — do not edit below this line ────────────────────

/**
 * Assembled and frozen configuration object consumed by the service layer.
 * Import this wherever Cloudinary settings are needed.
 */
export const cloudinaryConfig: CloudinaryConfig & { apiSecret: string } = Object.freeze({
  cloudName: CLOUD_NAME,
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  rootFolder: ROOT_FOLDER,
  adminApiBaseUrl: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`,
  deliveryBaseUrl: `https://res.cloudinary.com/${CLOUD_NAME}`,
  maxResultsPerPage: MAX_RESULTS_PER_PAGE,
});

/**
 * Convenience: the known wallpaper categories.
 * Add new category names here as you create matching folders in Cloudinary.
 */
export const WALLPAPER_CATEGORIES = ['Hot', 'Music', 'Gaming'] as const;

export type WallpaperCategory = (typeof WALLPAPER_CATEGORIES)[number];
