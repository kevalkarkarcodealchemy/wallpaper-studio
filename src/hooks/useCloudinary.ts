/**
 * useCloudinary Hook
 *
 * Manages all Cloudinary data-fetching state for a given wallpaper category.
 * Wraps the `cloudinary` service layer with React state primitives.
 *
 * Features
 * ────────
 *  • Category-scoped image fetching  (`getImages`)
 *  • Pagination / infinite scroll     (`loadMore`)
 *  • Pull-to-refresh                  (`refresh`)
 *  • Request cancellation on unmount or category change
 *  • Typed loading / error / data states
 *  • Zero UI logic — UI concerns stay in components
 *
 * Usage
 * ─────
 * ```tsx
 * const { images, loading, error, getImages, refresh, loadMore } = useCloudinary();
 *
 * // Fetch Music category
 * useEffect(() => { getImages('Music'); }, []);
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  fetchCategoryImages,
  fetchAllCategories,
} from '../services/cloudinary';
import type {
  CloudinaryError,
  CloudinaryHookReturn,
  CloudinaryImage,
} from '../types/cloudinary';

// ─── Internal state shape (not exported) ───────────────────────────────────

interface InternalState {
  images: CloudinaryImage[];
  loading: boolean;
  loadingMore: boolean;
  error: CloudinaryError | null;
  nextCursor: string | null;
  activeCategory: string | null;
}

const INITIAL_STATE: InternalState = {
  images: [],
  loading: false,
  loadingMore: false,
  error: null,
  nextCursor: null,
  activeCategory: null,
};

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Hook for fetching and managing Cloudinary wallpaper images.
 *
 * @returns `CloudinaryHookReturn` — stable references for all state and actions.
 */
export function useCloudinary(): CloudinaryHookReturn {
  const [state, setState] = useState<InternalState>(INITIAL_STATE);

  /**
   * Ref to the AbortController for the current in-flight request.
   * Cancelled automatically when:
   *  - the component unmounts
   *  - a new `getImages` call starts
   */
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel any pending request when the component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  /**
   * Cancel the current in-flight request and create a new AbortController.
   * Returns the new signal to pass to the service.
   */
  const resetAbortController = useCallback((): AbortSignal => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller.signal;
  }, []);

  // ─── getImages ────────────────────────────────────────────────────────────

  /**
   * Fetch the first page of images for `category`.
   * Resets all existing results before fetching.
   *
   * @param category - e.g. `"Music"`, `"Hot"`, `"Gaming"`
   */
  const getImages = useCallback(
    async (category: string): Promise<void> => {
      const signal = resetAbortController();

      setState({
        ...INITIAL_STATE,
        loading: true,
        activeCategory: category,
      });

      const result = await fetchCategoryImages(category, undefined, signal);

      // Ignore the result if the request was cancelled
      if (signal.aborted) return;

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
        images: result.data.images,
        nextCursor: result.data.nextCursor,
      }));
    },
    [resetAbortController],
  );

  // ─── loadMore ────────────────────────────────────────────────────────────

  /**
   * Append the next page of images to the existing list.
   * No-op if there is no next cursor or a request is already in progress.
   */
  const loadMore = useCallback(async (): Promise<void> => {
    const { activeCategory, nextCursor, loading, loadingMore } = state;

    if (!activeCategory || !nextCursor || loading || loadingMore) return;

    const signal = resetAbortController();

    setState((prev) => ({ ...prev, loadingMore: true, error: null }));

    const result = await fetchCategoryImages(
      activeCategory,
      nextCursor,
      signal,
    );

    if (signal.aborted) return;

    if (!result.success) {
      setState((prev) => ({
        ...prev,
        loadingMore: false,
        error: result.error,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loadingMore: false,
      images: [...prev.images, ...result.data.images],
      nextCursor: result.data.nextCursor,
    }));
  }, [state, resetAbortController]);

  // ─── refresh ─────────────────────────────────────────────────────────────

  /**
   * Re-fetch the first page for the currently active category.
   * Intended for pull-to-refresh patterns.
   * No-op if no category has been loaded yet.
   */
  const refresh = useCallback(async (): Promise<void> => {
    const { activeCategory } = state;
    if (!activeCategory) return;
    await getImages(activeCategory);
  }, [state, getImages]);

  // ─── Return ───────────────────────────────────────────────────────────────

  return {
    images: state.images,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    nextCursor: state.nextCursor,
    activeCategory: state.activeCategory,
    getImages,
    loadMore,
    refresh,
  };
}

// ─── Utility hook: categories ─────────────────────────────────────────────

interface UseCategoriesReturn {
  categories: string[];
  loading: boolean;
  error: CloudinaryError | null;
  refresh: () => Promise<void>;
}

/**
 * Companion hook that fetches the list of available wallpaper categories
 * directly from Cloudinary's folder structure.
 *
 * Falls back gracefully to the static `WALLPAPER_CATEGORIES` list from
 * config if the API call fails (e.g. in development before credentials
 * are set).
 *
 * @example
 * const { categories, loading } = useCloudinaryCategories();
 */
export function useCloudinaryCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CloudinaryError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async (): Promise<void> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const result = await fetchAllCategories(controller.signal);

    if (controller.signal.aborted) return;

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setCategories(result.data);
  }, []);

  useEffect(() => {
    fetchCategories();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchCategories]);

  return { categories, loading, error, refresh: fetchCategories };
}
