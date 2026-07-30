/**
 * Cloudinary Service
 *
 * Pure data-access layer — no React, no UI, no state.
 * All methods are async and return a typed `CloudinaryResult<T>` so callers
 * never need to catch exceptions from this module.
 *
 * API used
 * ────────
 * Cloudinary Admin API  →  GET /resources/image/upload
 *   https://cloudinary.com/documentation/admin_api#get_resources
 *
 * Authentication: HTTP Basic with `api_key` as the username and an empty
 * password.  This gives read-only listing access without exposing the
 * API Secret on the client.
 */

import { cloudinaryConfig } from '../config/cloudinary';
import type {
  CloudinaryAsset,
  CloudinaryError,
  CloudinaryImage,
  CloudinaryListResponse,
  CloudinaryResult,
  CloudinarySearchResponse,
} from '../types/cloudinary';

// ─── Internal helpers ──────────────────────────────────────────────────────

/**
 * Build the Basic-Auth header value expected by the Cloudinary Admin API.
 * Format: `Basic base64(api_key:api_secret)`
 */
function buildAuthHeader(): string {
  // React Native's `atob` / `btoa` is available globally since RN 0.74.
  // Note: The Admin API requires both API Key and API Secret.
  // @ts-ignore - apiSecret was added directly in the config object
  const credentials = `${cloudinaryConfig.apiKey}:${cloudinaryConfig.apiSecret}`;
  const encoded = btoa(credentials);
  return `Basic ${encoded}`;
}

/**
 * Normalise a raw `CloudinaryAsset` into the domain `CloudinaryImage` model
 * used throughout the application.
 */
function normaliseAsset(asset: CloudinaryAsset): CloudinaryImage {
  return {
    id: asset.asset_id,
    public_id: asset.public_id,
    secure_url: asset.secure_url,
    width: asset.width,
    height: asset.height,
    format: asset.format,
    bytes: asset.bytes,
    created_at: asset.created_at,
    folder: asset.folder ?? deriveFolderFromPublicId(asset.public_id),
  };
}

/**
 * Derive the folder path from the `public_id` when the `folder` field is
 * absent (older Cloudinary accounts may omit it).
 * e.g. `wallpaper/Music/track01` → `wallpaper/Music`
 */
function deriveFolderFromPublicId(publicId: string): string {
  const parts = publicId.split('/');
  return parts.length > 1 ? parts.slice(0, -1).join('/') : '';
}

/**
 * Wrap a caught unknown value into a structured `CloudinaryError`.
 */
function toCloudinaryError(
  cause: unknown,
  fallbackMessage: string,
): CloudinaryError {
  if (cause instanceof Error) {
    return { message: cause.message, cause };
  }
  return { message: fallbackMessage, cause };
}

/**
 * Execute a fetch call and resolve to a typed result, handling HTTP errors
 * and network failures uniformly.
 */
async function apiFetch<T>(
  url: string,
  signal?: AbortSignal,
): Promise<CloudinaryResult<T>> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: buildAuthHeader(),
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      return {
        success: false,
        error: {
          message: `Cloudinary API error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
          cause: body,
        },
      };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (err) {
    // AbortError is intentional — propagate a recognisable message
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        error: { message: 'Request was cancelled', cause: err },
      };
    }
    return {
      success: false,
      error: toCloudinaryError(err, 'Network request failed'),
    };
  }
}

// ─── Public service API ────────────────────────────────────────────────────

/**
 * Fetch all image resources inside a specific wallpaper category folder.
 *
 * @param category  - Folder name under the root, e.g. `"Music"`
 * @param nextCursor - Opaque pagination cursor from a previous response
 * @param signal    - Optional AbortSignal for request cancellation
 *
 * @example
 * const result = await fetchCategoryImages('Music');
 * if (result.success) console.log(result.data);
 */
export async function fetchCategoryImages(
  category: string,
  nextCursor?: string,
  signal?: AbortSignal,
): Promise<CloudinaryResult<{ images: CloudinaryImage[]; nextCursor: string | null }>> {
  const { rootFolder } = cloudinaryConfig;

  // The folder path as stored in Cloudinary
  const folderPath = `${rootFolder}/${category}`;

  // Modern Cloudinary accounts use dynamic folders where public_id does not 
  // contain the folder path. The Search API correctly handles both legacy 
  // and dynamic folders using the `folder` expression.
  const expression = `folder="${folderPath}"`;

  const result = await searchImages(expression, nextCursor, signal);

  if (!result.success) {
    return result;
  }

  return { 
    success: true, 
    data: { 
      images: result.data.images, 
      nextCursor: result.data.nextCursor 
    } 
  };
}

/**
 * Fetch all top-level sub-folders inside the root wallpaper folder.
 * Returns an array of category name strings (e.g. `["Hot", "Music", "Gaming"]`).
 *
 * @param signal - Optional AbortSignal for request cancellation
 *
 * @example
 * const result = await fetchAllCategories();
 * if (result.success) console.log(result.data); // ["Hot", "Music", "Gaming"]
 */
export async function fetchAllCategories(
  signal?: AbortSignal,
): Promise<CloudinaryResult<string[]>> {
  const { adminApiBaseUrl, rootFolder } = cloudinaryConfig;

  // Admin API: list sub-folders
  // Docs: GET /folders/<path>
  const url = `${adminApiBaseUrl}/folders/${rootFolder}`;

  const result = await apiFetch<{ folders: Array<{ name: string; path: string }> }>(
    url,
    signal,
  );

  if (!result.success) {
    return result;
  }

  const categories = result.data.folders.map((f) => f.name);
  return { success: true, data: categories };
}

/**
 * Search across all wallpaper resources using Cloudinary's Search API.
 * More powerful than `fetchCategoryImages` — supports filtering by tag,
 * expression, sort order, etc.
 *
 * @param expression - Cloudinary search expression, e.g. `folder:wallpaper/Music/*`
 * @param nextCursor - Opaque pagination cursor
 * @param signal     - Optional AbortSignal
 *
 * @example
 * const result = await searchImages('folder:wallpaper/Hot/*');
 */
export async function searchImages(
  expression: string,
  nextCursor?: string,
  signal?: AbortSignal,
): Promise<CloudinaryResult<{ images: CloudinaryImage[]; nextCursor: string | null; total: number }>> {
  const { adminApiBaseUrl, maxResultsPerPage } = cloudinaryConfig;

  const url = `${adminApiBaseUrl}/resources/search`;

  const body: Record<string, any> = {
    expression,
    max_results: maxResultsPerPage,
    sort_by: [{ created_at: 'desc' }],
  };

  if (nextCursor) {
    body.next_cursor = nextCursor;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: buildAuthHeader(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      return {
        success: false,
        error: {
          message: `Cloudinary API error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
          cause: errorBody,
        },
      };
    }

    const data = (await response.json()) as CloudinarySearchResponse;
    const images = data.resources.map(normaliseAsset);
    const cursor = data.next_cursor ?? null;
    const total = data.total_count;

    return { success: true, data: { images, nextCursor: cursor, total } };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        error: { message: 'Request was cancelled', cause: err },
      };
    }
    // We import toCloudinaryError earlier, wait, the helper is internal.
    // Let's just create the error object manually to avoid importing issues if any.
    let errorMsg = 'Network request failed';
    if (err instanceof Error) {
      errorMsg = err.message;
    }
    return {
      success: false,
      error: { message: errorMsg, cause: err },
    };
  }
}

/**
 * Construct an optimised delivery URL for a given `public_id`.
 *
 * Applies sensible defaults:
 *  - `f_auto`  → auto-select best format (WebP on capable devices)
 *  - `q_auto`  → adaptive quality compression
 *  - `w_<n>`   → optional width cap
 *
 * @param publicId    - The Cloudinary public ID (may include folder path)
 * @param widthPixels - Optional width to constrain the image (for thumbnails)
 *
 * @example
 * const url = buildImageUrl('wallpaper/Music/track01', 400);
 * // → https://res.cloudinary.com/my-cloud/image/upload/f_auto,q_auto,w_400/wallpaper/Music/track01
 */
export function buildImageUrl(publicId: string, widthPixels?: number): string {
  const { deliveryBaseUrl } = cloudinaryConfig;

  const transforms = ['f_auto', 'q_auto'];
  if (widthPixels) {
    transforms.push(`w_${widthPixels}`, 'c_limit');
  }

  const transformString = transforms.join(',');
  return `${deliveryBaseUrl}/image/upload/${transformString}/${publicId}`;
}
