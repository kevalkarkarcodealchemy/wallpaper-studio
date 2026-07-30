/**
 * Cloudinary TypeScript Types
 *
 * Strict, production-ready type definitions for all Cloudinary API
 * interactions used in the Wallpaper Studio app.
 *
 * No `any` types are used anywhere in this file.
 */

// ---------------------------------------------------------------------------
// Core domain model — what your UI works with
// ---------------------------------------------------------------------------

/**
 * A single wallpaper image as returned from Cloudinary and
 * normalised by the service layer.
 */
export interface CloudinaryImage {
  /** Cloudinary's unique asset identifier (e.g. `wallpaper/Music/track01`) */
  id: string;

  /** Full public ID including folder path */
  public_id: string;

  /** HTTPS delivery URL — safe to pass directly to <Image /> */
  secure_url: string;

  /** Pixel width of the original asset */
  width: number;

  /** Pixel height of the original asset */
  height: number;

  /** File extension without dot (e.g. `jpg`, `png`, `webp`) */
  format: string;

  /** File size in bytes */
  bytes: number;

  /** ISO-8601 timestamp string, e.g. `2024-01-15T10:30:00Z` */
  created_at: string;

  /** Folder path inside Cloudinary (e.g. `wallpaper/Music`) */
  folder: string;
}

// ---------------------------------------------------------------------------
// Cloudinary REST API raw response shapes
// ---------------------------------------------------------------------------

/**
 * A single resource object as returned by the Cloudinary
 * Admin / Search API before normalisation.
 */
export interface CloudinaryAsset {
  asset_id: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
  folder: string;
  resource_type: string;
  type: string;
  version: number;
  url: string;
  etag?: string;
  placeholder?: boolean;
  tags?: string[];
  context?: Record<string, string>;
}

/**
 * Paginated response from the Cloudinary Admin API
 * `GET /resources/image/upload` or `GET /resources/by_asset_folder`.
 */
export interface CloudinaryListResponse {
  resources: CloudinaryAsset[];
  /** Opaque cursor token — pass as `next_cursor` to get the next page. */
  next_cursor?: string;
  /** Present when there are more results beyond this page. */
  rate_limit_allowed?: number;
  rate_limit_remaining?: number;
  rate_limit_reset_at?: string;
}

/**
 * Response from Cloudinary's Search API endpoint.
 */
export interface CloudinarySearchResponse {
  resources: CloudinaryAsset[];
  total_count: number;
  time: number;
  next_cursor?: string;
  aggregations?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Service layer types
// ---------------------------------------------------------------------------

/**
 * Standardised result wrapper returned by every service method.
 * Avoids throwing errors across the service boundary.
 */
export type CloudinaryResult<T> =
  | { success: true; data: T }
  | { success: false; error: CloudinaryError };

/**
 * Structured error object produced by the Cloudinary service.
 */
export interface CloudinaryError {
  /** Human-readable message safe to show in UI */
  message: string;
  /** HTTP status code if the error came from a network call */
  statusCode?: number;
  /** Raw error for debugging (not shown in UI) */
  cause?: unknown;
}

// ---------------------------------------------------------------------------
// Hook types
// ---------------------------------------------------------------------------

/**
 * Shape of the state managed inside `useCloudinary`.
 */
export interface CloudinaryHookState {
  images: CloudinaryImage[];
  loading: boolean;
  error: CloudinaryError | null;
  /** Opaque cursor for the next page, `null` when no more pages exist */
  nextCursor: string | null;
}

/**
 * Public API exposed by the `useCloudinary` hook.
 */
export interface CloudinaryHookReturn extends CloudinaryHookState {
  /** Fetch (or re-fetch) images for `category` — resets the current list */
  getImages: (category: string) => Promise<void>;
  /** Load the next page of results for the current category */
  loadMore: () => Promise<void>;
  /** Re-fetch images for the currently active category */
  refresh: () => Promise<void>;
  /** Whether a paginated `loadMore` call is in progress */
  loadingMore: boolean;
  /** The category currently being displayed */
  activeCategory: string | null;
}

// ---------------------------------------------------------------------------
// Configuration type
// ---------------------------------------------------------------------------

/**
 * Typed shape of the Cloudinary configuration object.
 * Populated once from `src/config/cloudinary.ts`.
 */
export interface CloudinaryConfig {
  /** Your Cloudinary cloud name, e.g. `my-cloud` */
  cloudName: string;

  /**
   * Cloudinary API Key.
   * Required to list/search private/authenticated resources.
   * Safe to include in the bundle for read-only operations — never
   * bundle your API Secret.
   */
  apiKey: string;

  /** Root folder that contains all wallpaper category sub-folders */
  rootFolder: string;

  /** Base URL for the Cloudinary Admin API */
  adminApiBaseUrl: string;

  /** Base URL for the Cloudinary image delivery CDN */
  deliveryBaseUrl: string;

  /** Maximum number of resources to return per API call (max 500) */
  maxResultsPerPage: number;
}
